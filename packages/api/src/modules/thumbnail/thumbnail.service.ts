import { CreateRequestContext, EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { randomUUID } from "crypto";
import { once } from "events";
import type { FastifyReply, FastifyRequest } from "fastify";
import ffmpeg from "fluent-ffmpeg";
import { readFile, readdir, rm, stat } from "fs/promises";
import { DateTime } from "luxon";
import mime from "mime-types";
import ms from "ms";
import { tmpdir } from "os";
import { join } from "path";
import sharp from "sharp";
import { setTimeout } from "timers/promises";
import { dedupe } from "../../helpers/dedupe.js";
import type { FileEntity } from "../file/file.entity.js";
import { FileService } from "../file/file.service.js";
import { StorageService } from "../storage/storage.service.js";
import type { ThumbnailEntity } from "./thumbnail.entity.js";

@Injectable()
export class ThumbnailService {
  @InjectRepository("ThumbnailEntity") private thumbnailRepo: EntityRepository<ThumbnailEntity>;
  @InjectRepository("FileEntity") private fileRepo: EntityRepository<FileEntity>;

  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = "image/webp";
  static readonly IMAGE_TYPES = new Set(
    Object.keys(sharp.format)
      .map((key) => mime.lookup(key))
      .filter((key) => key && key.startsWith("image")),
  ) as Set<string>;

  static readonly VIDEO_TYPES = new Set([
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/x-matroska",
    "video/x-ms-wmv",
    "video/x-m4v",
    "video/x-flv",
  ]);

  private readonly log = new Logger(ThumbnailService.name);

  constructor(
    private storageService: StorageService,
    private fileService: FileService,
    private readonly em: EntityManager,
  ) {}

  async getThumbnail(fileId: string) {
    return this.thumbnailRepo.findOneOrFail({
      file: fileId,
    });
  }

  async createThumbnail(file: FileEntity) {
    if (file.thumbnailError) {
      throw new BadRequestException("Thumbnail creation has already failed.");
    }

    const isImage = ThumbnailService.IMAGE_TYPES.has(file.type);
    const isVideo = ThumbnailService.VIDEO_TYPES.has(file.type);
    if (!isImage && !isVideo) {
      throw new BadRequestException("That file type does not support thumbnails.");
    }

    try {
      const start = Date.now();
      let data: Buffer;
      if (isImage) {
        data = await this.createImageThumbnail(file);
      } else {
        data = await this.createVideoThumbnail(file);
      }

      const thumbnailMetadata = await sharp(data).metadata();
      const duration = Date.now() - start;
      const thumbnail = this.thumbnailRepo.create({
        data: data,
        duration: duration,
        size: data.length,
        type: ThumbnailService.THUMBNAIL_TYPE,
        width: thumbnailMetadata.width!,
        height: thumbnailMetadata.height!,
        file: file,
      });

      await this.em.persistAndFlush([file, thumbnail]);
      return thumbnail;
    } catch (error: any) {
      file.thumbnailError = error.message;
      await this.em.persistAndFlush(file);
      return null;
    }
  }

  private async createImageThumbnail(file: FileEntity) {
    const supported = ThumbnailService.IMAGE_TYPES.has(file.type);
    if (!supported) throw new Error("Unsupported image type.");
    this.log.debug(`Generating thumbnail for ${file.id} (${file.type})`);
    const fileStream = await this.storageService.createReadStream(file);
    const transformer = sharp().resize(ThumbnailService.THUMBNAIL_SIZE).webp();
    return fileStream.pipe(transformer).toBuffer();
  }

  private async createVideoThumbnail(file: FileEntity) {
    if (file.external) throw new Error("Cannot generate thumbnails for external videos.");

    const supported = ThumbnailService.VIDEO_TYPES.has(file.type);
    if (!supported) throw new Error("Unsupported video type.");

    const tempId = randomUUID();
    const tempDir = join(tmpdir(), `.thumbnail-workspace-${tempId}`);
    // const fileStream = await this.storageService.createReadStream(file);
    const filePath = this.storageService.getPathFromHash(file.hash);
    this.log.debug(`Generating video thumbnail at "${tempDir}"`);

    // i have no clue why but the internet told me that doing it in multiple invocations is faster
    // and it is so whatever. maybe there is a way to do this faster, but this is already pretty fast.
    const positions = ["5%", "10%", "20%", "40%"];
    const size = `${ThumbnailService.THUMBNAIL_SIZE}x?`;
    for (const [positionIndex, percent] of positions.entries()) {
      const stream = ffmpeg(filePath).screenshot({
        count: 1,
        timemarks: [percent],
        folder: tempDir,
        size: size,
        fastSeek: true,
        filename: `%b-${positionIndex + 1}.webp`,
      });

      await once(stream, "end");
    }

    const files = await readdir(tempDir);
    let largest: { size: number; path: string } | undefined;
    for (const file of files) {
      const path = join(tempDir, file);
      const stats = await stat(path);
      if (!largest || stats.size > largest.size) {
        largest = { size: stats.size, path };
      }
    }

    if (!largest) {
      await rm(tempDir, { recursive: true, force: true });
      throw new Error("No thumbnails were generated");
    }

    this.log.debug(`Largest thumbnail is at "${largest.path}", ${largest.size} bytes`);
    const content = await readFile(largest.path);
    await rm(tempDir, { recursive: true, force: true });
    return content;
  }

  static checkSupport(fileType: string) {
    return ThumbnailService.IMAGE_TYPES.has(fileType) || ThumbnailService.VIDEO_TYPES.has(fileType);
  }

  async sendThumbnail(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const existing = await this.thumbnailRepo.findOne({ file: fileId }, { populate: ["data"] });
    if (existing) {
      return reply
        .header("X-Micro-Generated", "false")
        .header("Content-Type", ThumbnailService.THUMBNAIL_TYPE)
        .header("Cache-Control", "public, max-age=31536000")
        .header("Expires", DateTime.local().plus({ years: 1 }).toHTTP())
        .header("X-Content-Type-Options", "nosniff")
        .send(existing.data.unwrap());
    }

    const file = await this.fileService.getFile(fileId, request);
    const thumbnail = await this.createThumbnail(file);
    if (!thumbnail) {
      throw new BadRequestException("Failed to generate thumbnail.");
    }

    return reply
      .header("X-Micro-Generated", "true")
      .header("X-Micro-Duration", thumbnail.duration)
      .header("Content-Type", ThumbnailService.THUMBNAIL_TYPE)
      .send(thumbnail.data.unwrap());
  }

  @Interval(1000)
  @CreateRequestContext()
  @dedupe()
  protected async generateThumbnail(): Promise<void> {
    const file = await this.fileRepo.findOne({
      thumbnail: null,
      thumbnailError: null,
      external: false,
      type: {
        $in: [...ThumbnailService.IMAGE_TYPES, ...ThumbnailService.VIDEO_TYPES],
      },
    });

    if (!file) {
      await setTimeout(ms("30s"));
      return;
    }

    await this.createThumbnail(file);
  }
}
