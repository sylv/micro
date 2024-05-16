import { EntityManager } from "@mikro-orm/core";
import { Controller, Get, Param, Request, Res } from "@nestjs/common";
import { type FastifyReply, type FastifyRequest } from "fastify";
import { LinkService } from "./link.service.js";

@Controller()
export class LinkController {
  constructor(
    private linkService: LinkService,
    private readonly em: EntityManager,
  ) {}

  @Get("link/:id")
  async followLink(@Param("id") id: string, @Request() request: FastifyRequest, @Res() reply: FastifyReply) {
    const link = await this.linkService.getLink(id, request);
    link.clicks++;
    await this.em.persistAndFlush(link);
    await reply.redirect(301, link.destination);
  }
}
