import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadRequestException, Injectable } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import sharp from "sharp";
import { THUMBNAIL_SUPPORTED_TYPES } from "../../constants";
import { File } from "../file/file.entity";
import { FileService } from "../file/file.service";
import { StorageService } from "../storage/storage.service";
import { Thumbnail } from "./thumbnail.entity";

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = "image/webp";
  constructor(
    @InjectRepository(Thumbnail) private thumbnailRepo: EntityRepository<Thumbnail>,
    @InjectRepository(File) private fileRepo: EntityRepository<File>,
    private storageService: StorageService,
    private fileService: FileService
  ) {}

  async getThumbnail(fileId: string) {
    return this.thumbnailRepo.findOneOrFail(fileId);
  }

  async createThumbnail(file: File) {
    const start = Date.now();
    const supported = ThumbnailService.checkThumbnailSupport(file.type);
    if (!supported) {
      throw new BadRequestException("That file type does not support thumbnails.");
    }

    // todo: this is inefficient, we should be able to get the file metadata at the same time
    // we generate the thumbnail and we should be able to get the thumbnail service better.
    const stream = this.storageService.createReadStream(file.hash);
    const transformer = sharp().resize(ThumbnailService.THUMBNAIL_SIZE).webp({ quality: 40 });
    const transformed = stream.pipe(transformer);
    // not actually sure why this returns the file metadata and not the thumbnail metadata.
    const fileMetadata = await transformed.metadata();
    const data = await transformed.toBuffer();
    const thumbnailMetadata = await sharp(data).metadata();
    const duration = Date.now() - start;
    // todo: file metadata should be a separate task that is run for every image missing metadata.
    file.metadata = {
      height: fileMetadata.height,
      width: fileMetadata.width,
    };

    file.thumbnail = this.thumbnailRepo.create({
      data: data,
      duration: duration,
      size: data.length,
      type: ThumbnailService.THUMBNAIL_TYPE,
      width: thumbnailMetadata.width!,
      height: thumbnailMetadata.height!,
      file: file,
    });

    await this.fileRepo.persistAndFlush(file);
    return file.thumbnail;
  }

  async sendThumbnail(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const existing = await this.thumbnailRepo.findOne(fileId, { populate: ["data"] });
    if (existing) {
      return reply
        .header("X-Micro-Generated", "false")
        .header("Content-Type", ThumbnailService.THUMBNAIL_TYPE)
        .send(existing.data);
    }

    const file = await this.fileService.getFile(fileId, request.host);
    const thumbnail = await this.createThumbnail(file);
    return reply
      .header("X-Micro-Generated", "true")
      .header("X-Micro-Duration", thumbnail.duration)
      .header("Content-Type", ThumbnailService.THUMBNAIL_TYPE)
      .send(thumbnail.data);
  }

  static checkThumbnailSupport(type: string) {
    return THUMBNAIL_SUPPORTED_TYPES.has(type);
  }
}
