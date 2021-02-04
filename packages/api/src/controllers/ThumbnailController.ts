import { Controller, Get, Param, Res, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { ThumbnailService } from "../services/ThumbnailService";
import { FileService } from "../services/FileService";
import { getRepository } from "typeorm";
import { Thumbnail } from "../entities/Thumbnail";
import { classToPlain } from "class-transformer";

@Controller()
export class ThumbnailController {
  constructor(readonly fileService: FileService, readonly thumbnailService: ThumbnailService) {}

  @Get("t/:key")
  async getFile(@Param("key") key: string, @Res() reply: FastifyReply) {
    const thumbnailRepo = getRepository(Thumbnail);
    const clean = this.fileService.cleanFileKey(key);
    const thumbnail = await thumbnailRepo.findOne({ file: { id: clean.id } });
    if (!thumbnail) throw new NotFoundException();
    if (clean.ext === "json") {
      return reply.send(classToPlain(thumbnail));
    }

    return this.thumbnailService.sendThumbnail(thumbnail, reply);
  }
}
