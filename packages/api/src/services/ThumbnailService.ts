import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { Thumbnail } from "../entities/Thumbnail";
import { FileService } from "./FileService";
import { S3Service } from "./S3Service";

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = "image/jpeg";
  private static readonly SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

  constructor(private s3Service: S3Service, private fileService: FileService) {}

  public static checkSupport(type: string) {
    return ThumbnailService.SUPPORTED_TYPES.has(type);
  }

  public async getThumbnail(fileId: string) {
    const thumbnailRepo = getRepository(Thumbnail);
    const thumbnail = await thumbnailRepo.findOne(fileId);
    if (!thumbnail) throw new NotFoundException();
    return thumbnail;
  }

  public async createThumbnail(file: File) {
    if (!file.thumbnail) {
      throw new BadRequestException("That file type does not support thumbnails.");
    }

    const start = Date.now();
    const thumbnailRepo = getRepository(Thumbnail);
    const stream = await this.s3Service.getStream(file.storageKey);
    const transformer = sharp().resize(ThumbnailService.THUMBNAIL_SIZE).jpeg();
    const transformed = stream.pipe(transformer);
    const thumbnail = thumbnailRepo.create({ id: file.id, size: 0 });
    thumbnail.size = await this.s3Service.uploadFile(transformed, {
      Key: thumbnail.storageKey,
      ContentType: ThumbnailService.THUMBNAIL_TYPE,
    });

    thumbnail.duration = Date.now() - start;
    await thumbnailRepo.save(thumbnail);
    return thumbnail;
  }

  public async sendThumbnail(fileId: string, reply: FastifyReply) {
    const thumbnailRepo = getRepository(Thumbnail);
    const existing = await thumbnailRepo.findOne({ id: fileId });
    if (existing) {
      reply.header("X-Micro-Generated", "false");
      return this.s3Service.sendFile(existing.storageKey, reply);
    }

    const file = await this.fileService.getFile(fileId);
    if (!file.thumbnail) throw new NotFoundException();
    const thumbnail = await this.createThumbnail(file);
    reply.header("X-Micro-Generated", "true");
    reply.header("X-Micro-Duration", thumbnail.duration);
    return this.s3Service.sendFile(thumbnail.storageKey, reply);
  }
}
