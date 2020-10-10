import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { FileService } from "../services/FileService";
import { ThumbnailService } from "../services/ThumbnailService";
import { FastifyRequest } from "fastify";

@Controller()
export class FileController {
  constructor(private fileService: FileService, private thumbnailService: ThumbnailService) {}

  @Get(["i/:key", "f/:key"])
  async getFile(@Param("key") key: string, @Res() reply: FastifyReply) {
    const fileRepo = getRepository(File);
    const cleanKey = this.fileService.cleanFileKey(key);
    const file = await fileRepo.findOne({ key: cleanKey });
    if (!file) throw new NotFoundException();
    return this.fileService.sendFile(file, reply);
  }

  @Delete(["/i/:key", "f/:key"])
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param("key") key: string, @Req() request: FastifyRequest) {
    const fileRepo = getRepository(File);
    const cleanKey = this.fileService.cleanFileKey(key);
    const file = await fileRepo.findOne({ key: cleanKey }, { relations: ["owner"] });
    if (!file) throw new NotFoundException();
    if (file.owner.id !== request.user) throw new UnauthorizedException();
    await fileRepo.remove(file);
    return { deleted: true };
  }

  @Get("d/:deleteKey")
  async deleteFileByKey(@Param("deleteKey") deleteKey: string) {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne({ deletion_key: deleteKey });
    if (!file) throw new NotFoundException();
    if (file.deletion_key !== deleteKey) throw new BadRequestException("Invalid deletion key");
    await fileRepo.remove(file);
    return { deleted: true };
  }

  @Get("t/:key")
  async getFileThumbnail(@Param("key") key: string, @Res() reply: FastifyReply) {
    const fileRepo = getRepository(File);
    const cleanKey = this.fileService.cleanFileKey(key);
    const file = await fileRepo.findOne({ where: { key: cleanKey }, relations: ["thumbnail"] });
    if (!file) throw new NotFoundException();
    if (file.parent ?? file.parent_id) throw new BadRequestException("Cannot generate thumbnails of thumbnails.");
    if (file.thumbnail) {
      reply.header("X-Micro-Generated", "false");
      return this.fileService.sendFile(file.thumbnail, reply);
    }

    const thumbnail = await this.thumbnailService.generateThumbnail(file);
    reply.header("X-Micro-Generated", "true");
    return this.fileService.sendFile(thumbnail, reply);
  }
}
