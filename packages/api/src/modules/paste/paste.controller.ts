import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { untrustedContentHeaders } from "../../helpers/untrusted-content-headers.js";
import { PasteService } from "./paste.service.js";

@Controller("paste")
export class PasteController {
  constructor(private pasteService: PasteService) {}

  @Get(":pasteId")
  async get(@Param("pasteId") pasteId: string, @Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const file = await this.pasteService.getPaste(pasteId, request);
    return reply.headers(untrustedContentHeaders("text/plain")).send(file.content);
  }
}
