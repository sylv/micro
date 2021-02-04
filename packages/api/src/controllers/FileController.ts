import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Query,
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
  async getFile(@Res() reply: FastifyReply, @Param("key") key: string, @Query("delete") deletionId?: string) {
    const fileRepo = getRepository(File);
    const clean = this.fileService.cleanFileKey(key);
    if (clean.ext === "json" || deletionId) {
      const file = await fileRepo.findOne(clean.id);
      if (!file) throw new NotFoundException();
      if (deletionId) {
        if (file.deletionId !== deletionId) throw new ForbiddenException();
        await fileRepo.delete(file.id);
        return reply.send({ deleted: true });
      }

      return reply.send(classToPlain(file));
    }

    return this.fileService.sendFileById(clean.id, reply);
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
