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
import { UserId } from "../decorators/UserId";
import { ContentType } from "../entities/base/Content";
import { DeletionService } from "../services/DeletionService";
import { FileService } from "../services/FileService";
import { LinkService } from "../services/LinkService";
import { getRepository } from "typeorm";
import { Link } from "../entities/Link";

@Controller()
export class LinkController {
  constructor(
    protected fileService: FileService,
    protected linkService: LinkService,
    protected deletionService: DeletionService
  ) {}

  @Get(["link/:id", "s/:id"])
  async getLinkPage(@Res() reply: FastifyReply, @Param("id") id: string) {
    const linkRepo = getRepository(Link);
    const link = await this.getLink(id);
    if (!link) throw new NotFoundException();
    await reply.redirect(301, link.destination);
    await linkRepo.increment({ id: link.id }, "clicks", 1);
  }

  @Get("api/link/:id")
  async getLink(@Param("id") id: string) {
    return this.linkService.getLink(id);
  }

  @Delete("api/link/:id")
  async deleteLink(@UserId() userId: string, @Param("id") id: string) {
    return this.linkService.deleteLink(id, userId);
  }

  @Post("api/link")
  async createLink(@UserId() userId: string, @Query("url") url?: string) {
    if (!url?.startsWith("http")) throw new BadRequestException("Invalid URL.");
    const link = await this.linkService.createLink(url, userId);
    const deletionUrl = this.deletionService.getDeletionUrl(ContentType.LINK, link.id);
    return {
      direct: link.getUrl(),
      delete: deletionUrl,
    };
  }
}
