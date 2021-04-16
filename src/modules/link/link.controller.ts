import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import { prisma } from "../../prisma";
import { UserId } from "../auth/auth.decorators";
import { ContentType, DeletionService } from "../deletion/deletion.service";
import { LinkService } from "./link.service";

@Controller()
export class LinkController {
  constructor(private linkService: LinkService, private deletionService: DeletionService) {}

  @Get(["link/:id", "s/:id"])
  async getPage(@Res() reply: FastifyReply, @Param("id") id: string) {
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
  async get(@Param("id") id: string) {
    return this.linkService.get(id);
  }

  @Delete("api/link/:id")
  async delete(@UserId() userId: string, @Param("id") id: string) {
    return this.linkService.delete(id, userId);
  }

  @Post("api/link")
  async create(@UserId() userId: string, @Query("url") url?: string) {
    if (!url?.startsWith("http")) throw new BadRequestException("Invalid URL.");
    const link = await this.linkService.create(url, userId);
    const deletionUrl = this.deletionService.create(ContentType.LINK, link.id);
    const urls = this.linkService.getUrls(link);
    return Object.assign(urls, { delete: deletionUrl });
  }
}
