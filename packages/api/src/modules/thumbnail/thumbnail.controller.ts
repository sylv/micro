import { wrap } from "@mikro-orm/core";
import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { parseKey } from "../../helpers/parse-key.helper";
import { FileService } from "../file/file.service";
import { ThumbnailService } from "./thumbnail.service";

@Controller()
export class ThumbnailController {
  constructor(private fileService: FileService, private thumbnailService: ThumbnailService) {}

  @Get("thumbnail/:key")
  async getThumbnail(@Param("key") key: string, @Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const parsed = parseKey(key);
    if (parsed.ext === "json") {
      const thumbnail = await this.thumbnailService.getThumbnail(parsed.id);
      return reply.status(200).send(wrap(thumbnail).toPOJO());
    }

    return this.thumbnailService.sendThumbnail(parsed.id, request, reply);
  }
}
