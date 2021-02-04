import { Injectable, InternalServerErrorException } from "@nestjs/common";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { Thumbnail } from "../entities/Thumbnail";
import { FastifyReply } from "fastify";

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = "image/jpeg";
  private static readonly THUMBNAIL_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]);

  /**
   * Generate a thumbnail for the given file.
   * The thumbnail is not saved to the database.
   * If file.thumbnail is set, it will be returned instead.
   */
  public async generateThumbnail(file: File) {
    if (file.thumbnail) return file.thumbnail;
    if (!file.data) throw new InternalServerErrorException("Missing file data");
    if (!ThumbnailService.THUMBNAIL_TYPES.has(file.type)) return;

    const thumbnailRepo = getRepository(Thumbnail);
    const start = Date.now();
    const data = await sharp(file.data).resize(ThumbnailService.THUMBNAIL_SIZE).jpeg().toBuffer();
    const duration = Date.now() - start;
    const thumbnail = thumbnailRepo.create({
      data: data,
      duration: duration,
      owner: file.owner,
      size: data.length,
    });

    return thumbnail;
  }

  /**
   * Reply to a request with the given thumbnail.
   */
  public async sendThumbnail(thumbnail: Thumbnail, reply: FastifyReply) {
    if (!thumbnail.data) throw new InternalServerErrorException("Missing thumbnail data");
    reply.header("Content-Length", thumbnail.size);
    reply.header("Last-Modified", thumbnail.createdAt.toUTCString());
    reply.header("X-Micro-FileId", thumbnail.fileId);
    reply.header("X-Micro-ThumbnailId", thumbnail.id);
    reply.header("X-Micro-OwnerId", thumbnail.ownerId);
    reply.header("Content-Type", ThumbnailService.THUMBNAIL_TYPE);
    reply.send(thumbnail.data);

    // increment view count
    const thumbnailRepo = getRepository(Thumbnail);
    await thumbnailRepo.increment({ id: thumbnail.id }, "views", 1);
  }
}
