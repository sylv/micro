import {
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
import { classToPlain } from "class-transformer";
import { FastifyReply, FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { FileService } from "../services/FileService";

@Controller()
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(["i/:key", "f/:key"])
  async getFile(@Param("key") key: string, @Res() reply: FastifyReply) {
    const fileRepo = getRepository(File);
    const clean = this.fileService.cleanFileKey(key);
    const file = await fileRepo.findOne(clean.id);
    if (!file) throw new NotFoundException();
    if (clean.ext === "json") {
      return reply.send(classToPlain(file));
    }

    return this.fileService.sendFile(file, reply);
  }

  @Delete(["/i/:key", "f/:key"])
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param("key") key: string, @Req() request: FastifyRequest) {
    const fileRepo = getRepository(File);
    const clean = this.fileService.cleanFileKey(key);
    const file = await fileRepo.findOne(clean.id, { relations: ["owner"] });
    if (!file) throw new NotFoundException();
    if (file.owner.id !== request.user) throw new UnauthorizedException();
    await fileRepo.remove(file);
    return { deleted: true };
  }

  @Get("d/:deletionId")
  async deleteFileByKey(@Param("deletionId") deletionId: string) {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne({ deletionId });
    if (!file) throw new NotFoundException();
    await fileRepo.remove(file);
    return { deleted: true };
  }
}
