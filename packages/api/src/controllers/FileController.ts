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
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { isImageScraper } from "../helpers/isImageScraper";
import { FileService } from "../services/FileService";
import { RenderableReply } from "../types";

@Controller()
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(["file/:key", "f/:key"])
  async getFile(@Res() reply: RenderableReply, @Req() request: FastifyRequest, @Param("key") key: string) {
    const fileRepo = getRepository(File);
    const clean = this.fileService.cleanFileKey(key);
    const options = { relations: ["owner"] };
    if (clean.ext === "json") {
      const file = await fileRepo.findOne(clean.id, options);
      if (!file) throw new NotFoundException();
      return reply.send(classToPlain(file));
    }

    // discord (and i imagine other sites) wont embed the image unless we return an image
    // so we override defaulting to html here for those user-agents
    const isScraper = isImageScraper(request.headers["user-agent"]);
    const file = await fileRepo.findOne(clean.id, options);
    if (!file) {
      return reply.render("404");
    }

    if (clean.ext || (isScraper && file.embeddable)) {
      return this.fileService.sendFile(file, reply);
    }

    return reply.render("file/[fileId]", {
      fileId: file.id,
      file: JSON.stringify(classToPlain(file)),
    });
  }

  @Delete(["/file/:key", "f/:key"])
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

  @Get(["/delete/:key", "/d/:key"])
  async deleteFileByKey(@Param("key") key: string) {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne({ deletionId: key });
    if (!file) {
      throw new NotFoundException();
    }

    await fileRepo.delete(file.id);
    return {
      deleted: true,
    };
  }
}
