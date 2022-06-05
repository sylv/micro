import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  Res,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { UserId } from "../auth/auth.decorators";
import { LinkService } from "./link.service";
import { Link } from "./link.entity";

@Controller()
export class LinkController {
  constructor(@InjectRepository(Link) private linkRepo: EntityRepository<Link>, private linkService: LinkService) {}

  @Get("link/:id/go")
  async followLink(@Param("id") id: string, @Request() request: FastifyRequest, @Res() reply: FastifyReply) {
    const link = await this.linkService.getLink(id, request.host);
    link.clicks++;
    await this.linkRepo.persistAndFlush(link);
    reply.redirect(301, link.destination);
  }

  @Get("link/:id")
  async getLink(@Request() request: FastifyRequest, @Param("id") id: string) {
    return this.linkService.getLink(id, request.host);
  }
}
