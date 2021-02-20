import { Injectable, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { config } from "../config";
import { Thumbnail } from "../entities/Thumbnail";
import { s3 } from "../s3";
import { S3Service } from "./S3Service";
import { File } from "../entities/File";
import { PassThrough } from "stream";

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = "image/jpeg";
  private static readonly SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

  constructor(private s3Service: S3Service) {}

  public async getThumbnail(fileId: string) {
    const thumbnailRepo = getRepository(Thumbnail);
    const thumbnail = await thumbnailRepo.findOne(fileId);
    if (!thumbnail) throw new NotFoundException();
    return thumbnail;
  }

  public async createThumbnail(rawStream: NodeJS.ReadableStream, file: File) {
    if (!ThumbnailService.SUPPORTED_TYPES.has(file.type)) return;
    const passthrough = rawStream.pipe(new PassThrough());
    const start = Date.now();
    const thumbnailRepo = getRepository(Thumbnail);
    const transformer = sharp().resize(ThumbnailService.THUMBNAIL_SIZE).jpeg();
    const thumbnailStream = passthrough.pipe(transformer);
    const thumbnail = thumbnailRepo.create({ id: file.id, size: 0 });
    transformer.on("chunk", (chunk) => (thumbnail.size += chunk.length));
    await s3
      .upload({
        Bucket: config.storage.bucket,
        Key: thumbnail.storageKey,
        Body: thumbnailStream,
        ContentType: ThumbnailService.THUMBNAIL_TYPE,
      })
      .promise();

    thumbnail.duration = Date.now() - start;
    return thumbnail;
  }

  public async sendThumbnail(thumbnailId: string, reply: FastifyReply) {
    const thumbnailRepo = getRepository(Thumbnail);
    const thumbnail = thumbnailRepo.create({ id: thumbnailId });
    return this.s3Service.sendFile(thumbnail.storageKey, reply);
  }
}
