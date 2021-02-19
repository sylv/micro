import { classToPlain } from "class-transformer";
import { FastifyRequest } from "fastify";
import { UserId } from "../decorators/UserId";
import { ContentType } from "../entities/base/Content";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { UploadAuthGuard } from "../guards/UploadAuthGuard";
import { isImageScraper } from "../helpers/isImageScraper";
import { DeletionService } from "../services/DeletionService";
import { FileService } from "../services/FileService";
import { RenderableReply } from "../types";
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";

@Controller()
export class FileController {
  constructor(private fileService: FileService, private deletionService: DeletionService) {}

  @Get(["file/:key", "f/:key"])
  async getFilePage(@Res() reply: RenderableReply, @Req() request: FastifyRequest, @Param("key") key: string) {
    const clean = this.fileService.cleanFileKey(key);
    if (clean.ext) {
      return this.fileService.sendFile(clean.id, reply);
    }

    // discord wont embed unless we return an image, so we have to detect their user-agents and
    // return it specifically for them. this might break if they update their second scraper ua
    const isScraper = isImageScraper(request.headers["user-agent"]);
    const file = await this.getFile(clean.id);
    if (!file) throw new NotFoundException();
    if (isScraper && file.embeddable) {
      return this.fileService.sendFile(file.id, reply);
    }

    return reply.render("file/[fileId]", {
      fileId: clean.id,
      file: JSON.stringify(classToPlain(file)),
    });
  }

  @Get("api/file/:id")
  async getFile(@Param("id") id: string) {
    return this.fileService.getFile(id);
  }

  @Delete("api/file/:id")
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param("id") id: string, @UserId() userId: string) {
    await this.fileService.deleteFile(id, userId);
    return { deleted: true };
  }

  @Post("api/file")
  @UseGuards(UploadAuthGuard)
  async createFile(@UserId() userId: string, @Req() request: FastifyRequest) {
    const upload = await request.file();
    if (!upload) throw new BadRequestException("Missing upload.");
    const data = await upload.toBuffer();
    const file = await this.fileService.createFile(data, upload.filename, upload.mimetype, userId);
    const deletionUrl = this.deletionService.getDeletionUrl(ContentType.FILE, file.id);
    return Object.assign(file.url, {
      delete: deletionUrl,
    });
  }
}
