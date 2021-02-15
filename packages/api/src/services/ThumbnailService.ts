import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { Thumbnail } from "../entities/Thumbnail";
import { FastifyReply } from "fastify";

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 300;
  private static readonly THUMBNAIL_TYPE = "image/jpeg";
  private static readonly THUMBNAIL_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]);

  public async getThumbnail(fileId: string) {
    const thumbnailRepo = getRepository(Thumbnail);
    const thumbnail = await thumbnailRepo.findOne({
      file: {
        id: fileId,
      },
    });

    if (!thumbnail) throw new NotFoundException();
    return thumbnail;
  }

  public async createThumbnail(file: File) {
    if (file.thumbnail) return file.thumbnail;
    if (!ThumbnailService.THUMBNAIL_TYPES.has(file.type)) return;
    if (!file.data) {
      throw new InternalServerErrorException("Missing file data");
    }

    const thumbnailRepo = getRepository(Thumbnail);
    const start = Date.now();
    const data = await sharp(file.data).resize(ThumbnailService.THUMBNAIL_SIZE).jpeg().toBuffer();
    const duration = Date.now() - start;
    return thumbnailRepo.create({
      data: data,
      duration: duration,
      owner: file.owner,
      size: data.length,
    });
  }

  public async sendThumbnail(fileId: string, reply: FastifyReply) {
    const thumbnail = await this.getThumbnail(fileId);
    if (!thumbnail) {
      throw new NotFoundException();
    }

    reply.header("Content-Length", thumbnail.size);
    reply.header("Last-Modified", thumbnail.createdAt.toUTCString());
    reply.header("X-Micro-FileId", thumbnail.fileId);
    reply.header("X-Micro-ThumbnailId", thumbnail.id);
    reply.header("X-Micro-OwnerId", thumbnail.ownerId);
    reply.header("Content-Type", ThumbnailService.THUMBNAIL_TYPE);

    await reply.send(thumbnail.data);
  }
}
