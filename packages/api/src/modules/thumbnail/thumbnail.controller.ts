import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { FileService } from "../file/file.service";
import { ThumbnailService } from "./thumbnail.service";

@Controller()
export class ThumbnailController {
  constructor(private fileService: FileService, private thumbnailService: ThumbnailService) {}

  @Get("thumbnail/:id")
  async getThumbnail(@Param("id") id: string) {
    return this.thumbnailService.getThumbnail(id);
  }
}
