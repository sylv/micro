import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import sharp from "sharp";
import { EMBEDDABLE_IMAGE_TYPES } from "../../constants";
import { prisma } from "../../prisma";
import { FileService } from "../file/file.service";
import { File } from "@prisma/client";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = "image/webp";
  constructor(private storageService: StorageService, private fileService: FileService) {}

  async getThumbnail(fileId: string) {
    const thumbnail = await prisma.thumbnail.findFirst({ where: { id: fileId } });
    if (!thumbnail) throw new NotFoundException();
    return thumbnail;
  }

  async createThumbnail(file: File) {
    const start = Date.now();
    const supported = this.checkThumbnailSupport(file.type);
    if (!supported) {
      throw new BadRequestException("That file type does not support thumbnails.");
    }

    const stream = this.storageService.createReadStream(file.hash);
    const transformer = sharp().resize(ThumbnailService.THUMBNAIL_SIZE).webp({ quality: 40 });
    const data = await stream.pipe(transformer).toBuffer();
    const duration = Date.now() - start;
    const thumbnail = prisma.thumbnail.create({
      data: {
        id: file.id,
        data: data,
        duration: duration,
        size: data.length,
        file: {
          connect: {
            id: file.id,
          },
        },
      },
    });

    return thumbnail;
  }

  async sendThumbnail(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const existing = await prisma.thumbnail.findFirst({ where: { id: fileId } });
    if (existing) {
      return reply.header("X-Micro-Generated", "false").header("Content-Type", ThumbnailService.THUMBNAIL_TYPE).send(existing.data);
    }

    const file = await this.fileService.getFile(fileId, request.host);
    const supported = this.checkThumbnailSupport(file.type);
    if (!supported) throw new NotFoundException("That file does not support thumbnails.");
    const thumbnail = await this.createThumbnail(file);
    return reply
      .header("X-Micro-Generated", "true")
      .header("X-Micro-Duration", thumbnail.duration)
      .header("Content-Type", ThumbnailService.THUMBNAIL_TYPE)
      .send(thumbnail.data);
  }

  checkThumbnailSupport(type: string) {
    return EMBEDDABLE_IMAGE_TYPES.includes(type);
  }
}
