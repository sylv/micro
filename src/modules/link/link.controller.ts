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
import { prisma } from "../../prisma";
import { UserId } from "../auth/auth.decorators";
import { ContentType, DeletionService } from "../deletion/deletion.service";
import { LinkService } from "./link.service";

@Controller()
export class LinkController {
  constructor(private linkService: LinkService, private deletionService: DeletionService) {}

  @Get(["link/:id", "s/:id"])
  async getLinkPage(@Res() reply: FastifyReply, @Param("id") id: string) {
    const link = await prisma.link.findFirst({ where: { id } });
    if (!link) throw new NotFoundException();
    await reply.redirect(301, link.destination);
    await prisma.link.update({
      where: { id: link.id },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }

  @Get("api/link/:id")
  async getLink(@Param("id") id: string, @Request() request: FastifyRequest) {
    return this.linkService.getLink(id, request.host);
  }

  @Delete("api/link/:id")
  async deleteLink(@UserId() userId: string, @Param("id") id: string) {
    return this.linkService.deleteLink(id, userId);
  }

  @Post("api/link")
  async createLink(@UserId() userId: string, @Query("url") url?: string) {
    if (!url?.startsWith("http")) throw new BadRequestException("Invalid URL.");
    const link = await this.linkService.createLink(url, userId);
    const deletionUrl = this.deletionService.createToken(ContentType.LINK, link.id);
    const urls = this.linkService.getLinkUrls(link);
    return Object.assign(urls, { delete: deletionUrl });
  }
}
