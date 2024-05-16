import { Controller, Get, Param, Req } from "@nestjs/common";
import { type FastifyRequest } from "fastify";
import { PasteService } from "./paste.service.js";

@Controller("paste")
export class PasteController {
  constructor(private pasteService: PasteService) {}

  @Get(":pasteId")
  async get(@Param("pasteId") pasteId: string, @Req() request: FastifyRequest) {
    const file = await this.pasteService.getPaste(pasteId, request);
    return file.content;
  }
}
