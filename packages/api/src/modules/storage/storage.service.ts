import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { CreateRequestContext, EntityManager, type FilterQuery } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, Logger, type OnApplicationBootstrap } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import crypto from "crypto";
import { once } from "events";
import fs, { existsSync, mkdirSync, rmdirSync } from "fs";
import { nanoid } from "nanoid";
import path from "path";
import type { Readable } from "stream";
import { pipeline } from "stream/promises";
import { config } from "../../config.js";
import { FileEntity } from "../file/file.entity.js";
import { ExifTransformer } from "./exif.transformer.js";
import { SizeTransform } from "./size.transformer.js";
import sharp from "sharp";
import { setTimeout } from "timers/promises";
import ms from "ms";
import { dedupe } from "../../helpers/dedupe.js";
import { ThumbnailService } from "../thumbnail/thumbnail.service.js";
import { DateTime } from "luxon";
import bytes from "bytes";

@Injectable()
export class StorageService implements OnApplicationBootstrap {
  @InjectRepository("FileEntity") private fileRepo: EntityRepository<FileEntity>;

  private readonly createdPaths = new Set();
  private readonly logger = new Logger(StorageService.name);
  private s3Client?: S3Client;
  private tempUploadDir = path.join(config.storagePath, ".tmp");

  constructor(private em: EntityManager) {
    if (config.externalStorage) {
      this.s3Client = new S3Client({
        region: config.externalStorage.region,
        endpoint: config.externalStorage.endpoint,
        forcePathStyle: config.externalStorage.forcePathStyle,
        credentials: {
          accessKeyId: config.externalStorage.credentials.accessKeyId,
          secretAccessKey: config.externalStorage.credentials.secretAccessKey,
        },
      });
    }

    // empty out temp dir
    if (existsSync(this.tempUploadDir)) rmdirSync(this.tempUploadDir, { recursive: true });
    mkdirSync(this.tempUploadDir, { recursive: true });
  }

  async create(stream: NodeJS.ReadableStream) {
    // using .tmp in the upload dir solves cross-device link issues
    // todo: using .tmp instead of the actual temp folder means if the process exits half way through an upload,
    // that file will be left behind. we could just use `fs-extra` and `/tmp` but that isn't great either since it means
    // we're copying the file which is slow, especially for large files.
    const uploadId = nanoid(6);
    const uploadPath = path.join(this.tempUploadDir, `.micro${uploadId}`);

    try {
      const hashStream = crypto.createHash("sha256");
      const exifTransform = new ExifTransformer();
      const sizeTransform = new SizeTransform();
      const writeStream = fs.createWriteStream(uploadPath);

      let metadata: sharp.Metadata | undefined;
      const metadataStream = sharp().metadata((error, data) => {
        metadata = data;
      });

      await Promise.all([
        pipeline(stream, hashStream),
        pipeline(stream, metadataStream),
        pipeline(stream, exifTransform, sizeTransform, writeStream),
      ]);

      const digest = hashStream.digest("hex");
      const filePath = this.getPathFromHash(digest);
      await this.ensureDirectoryExists(filePath);
      await fs.promises.rename(uploadPath, filePath);
      return {
        hash: digest,
        size: sizeTransform.sizeInBytes,
        metadata,
      };
    } catch (error: unknown) {
      await fs.promises.unlink(uploadPath).catch(() => false);
      throw error;
    }
  }

  async delete(file: { hash: string; external: boolean }) {
    this.logger.debug(`Deleting file "${file.hash}"`);
    if (file.external) {
      if (!this.s3Client || !config.externalStorage) {
        throw new Error("File is external but external storage is not configured");
      }

      const s3Key = this.getFolderFromHash(file.hash);
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: config.externalStorage.bucket,
          Key: s3Key,
        }),
      );

      return;
    }

    try {
      const filePath = this.getPathFromHash(file.hash);
      await fs.promises.unlink(filePath);
    } catch (error: any) {
      if (error.code === "ENOENT") return;
      throw error;
    }
  }

  async createReadStream(
    file: { hash: string; external: boolean },
    range?: { start?: number | null; end?: number | null } | null,
  ) {
    if (file.external) {
      if (!this.s3Client || !config.externalStorage)
        throw new Error("File is external but external storage is not configured");

      const s3Key = this.getFolderFromHash(file.hash);
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: config.externalStorage.bucket,
          Key: s3Key,
        }),
      );

      return response.Body as Readable;
    }

    const filePath = this.getPathFromHash(file.hash);
    const stream = fs.createReadStream(filePath, {
      start: range?.start ?? undefined,
      end: range?.end ?? undefined,
    });

    await once(stream, "open");
    return stream;
  }

  public getPathFromHash(hash: string) {
    return path.join(config.storagePath, this.getFolderFromHash(hash));
  }

  private getFolderFromHash(hash: string) {
    return path.join(hash[0], hash[1], hash);
  }

  private async ensureDirectoryExists(filePath: string) {
    const fileDirectory = path.dirname(filePath);
    if (!this.createdPaths.has(fileDirectory)) {
      await fs.promises.mkdir(fileDirectory, { recursive: true });
      this.createdPaths.add(fileDirectory);
    }
  }

  @Interval(1000)
  @CreateRequestContext()
  @dedupe()
  protected async uploadToExternalStorage(): Promise<void> {
    if (!config.externalStorage || !this.s3Client) return;

    const filter: FilterQuery<FileEntity>[] = [];
    if (config.externalStorage.filter.maxSize) {
      filter.push({ size: { $lte: config.externalStorage.filter.maxSize } });
    }
    if (config.externalStorage.filter.minSize) {
      filter.push({ size: { $gte: config.externalStorage.filter.minSize } });
    }
    if (config.externalStorage.filter.decayDuration) {
      const decayDate = new Date(Date.now() - config.externalStorage.filter.decayDuration);
      filter.push({ createdAt: { $lte: decayDate } });
    }

    const file = await this.fileRepo.findOne(
      {
        external: false,
        externalError: null,
        $and: filter,
        // we want to generate thumbnails while the file is not external, because it
        // saves s3 calls which may cost money.
        $or: [
          { thumbnail: { $ne: null } },
          { thumbnailError: { $ne: null } },
          { type: { $nin: [...ThumbnailService.IMAGE_TYPES, ...ThumbnailService.VIDEO_TYPES] } },
        ],
      },
      {
        fields: ["type", "size", "hash", "external", "externalError"],
      },
    );

    if (!file) {
      await setTimeout(ms("5m"));
      return;
    }

    try {
      const stream = await this.createReadStream(file, null);
      const s3Path = this.getFolderFromHash(file.hash);
      this.logger.log(`Uploading ${file.id} to external store`);
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: config.externalStorage.bucket,
          Key: s3Path,
          ContentType: file.type,
          ContentLength: file.size,
          Body: stream,
        }),
      );

      file.external = true;
      await this.em.persistAndFlush(file);

      this.logger.log(`Finished uploading ${file.id} to external store`);
      await fs.promises.unlink(this.getPathFromHash(file.hash));
    } catch (error: any) {
      file.externalError = error.message;
      await this.em.persistAndFlush(file);

      this.logger.error(`Failed to upload ${file.id} to external store`, error);
      this.logger.error("This is a bug, report it on github!");
      this.logger.warn("Retrying external store uploads in 30 minutes");
      await setTimeout(ms("30m"));
    }
  }

  @Interval(1000)
  @CreateRequestContext()
  @dedupe()
  protected async purgeFiles() {
    if (!config.purge) return;
    const createdBefore = new Date(Date.now() - config.purge.afterTime);
    const filters: FilterQuery<FileEntity> = [];
    if (config.purge.underViews) {
      filters.push({
        views: { $lt: config.purge.underViews },
      });
    }

    const files = await this.fileRepo.find(
      {
        $and: filters,
        size: {
          $gte: config.purge.overLimit,
        },
        createdAt: {
          $lte: createdBefore,
        },
      },
      {
        limit: 10,
        fields: ["size", "createdAt", "external", "hash"],
      },
    );

    for (const file of files) {
      const size = bytes.format(file.size);
      const age = DateTime.fromJSDate(file.createdAt).toRelative();
      await this.em.removeAndFlush(file);
      await this.delete(file);
      this.logger.log(`Purging ${file.id} (${size}, ${age})`);
    }

    if (files[0]) {
      this.logger.log(`Purged ${files.length} files`);
    } else {
      await setTimeout(ms("10m"));
    }
  }

  onApplicationBootstrap() {
    if (config.purge) {
      const size = bytes.format(config.purge.overLimit);
      const age = DateTime.local().minus(config.purge.afterTime).toRelative();
      this.logger.warn(`Purging files is enabled for files over ${size} uploaded more than ${age}.`);
    }
  }
}
