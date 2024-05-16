import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { ThumbnailService } from "./thumbnail.service.js";

@Controller()
export class ThumbnailController {
  constructor(private thumbnailService: ThumbnailService) {}

  @Get("thumbnail/:fileId")
  async getThumbnailContent(
    @Param("fileId") fileId: string,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    return this.thumbnailService.sendThumbnail(fileId, request, reply);
  }
}
