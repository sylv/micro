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

    const stream = this.storageService.createReadStream(file.hash);
    const transformer = sharp().resize(ThumbnailService.THUMBNAIL_SIZE).webp({ quality: 40 });
    const data = await stream.pipe(transformer).toBuffer();
    const duration = Date.now() - start;
    file.thumbnail = this.thumbnailRepo.create({
      data: data,
      duration: duration,
      size: data.length,
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
