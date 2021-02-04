import { Controller, ForbiddenException, Get, NotFoundException, Param, Query, Res } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { FastifyReply } from "fastify";
import { getRepository } from "typeorm";
import { Link } from "../entities/Link";
import { FileService } from "../services/FileService";

@Controller()
export class LinkController {
  constructor(readonly fileService: FileService) {}

  @Get("/s/:key")
  async link(@Res() reply: FastifyReply, @Param("key") key: string, @Query("delete") deletionId?: string) {
    const clean = this.fileService.cleanFileKey(key);
    const linkRepo = getRepository(Link);
    const link = await linkRepo.findOne(clean.id);
    if (!link) throw new NotFoundException();
    if (deletionId) {
      if (link.deletionId !== deletionId) throw new ForbiddenException();
      await linkRepo.delete(link.id);
      return reply.send({ deleted: true });
    }

    if (clean.ext === "json") {
      return reply.send(classToPlain(link));
    }

    return reply.redirect(301, link.destination);
  }
}
