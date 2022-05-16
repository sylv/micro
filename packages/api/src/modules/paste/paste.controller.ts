import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { config } from "../../config";
import { generateContentId, generateParanoidId } from "../../helpers/generate-content-id.helper";
import { OptionalJWTAuthGuard } from "../auth/guards/optional-jwt.guard";
import { CreatePasteDto, Paste } from "./paste.entity";
import { PasteService } from "./paste.service";

@Controller("paste")
export class PasteController {
  constructor(
    @InjectRepository(Paste) private pasteRepo: EntityRepository<Paste>,
    private pasteService: PasteService
  ) {}

  @Post()
  @UseGuards(OptionalJWTAuthGuard)
  async create(@Body() pasteBody: CreatePasteDto, @Req() request: FastifyRequest) {
    if (!request.user && !config.publicPastes) {
      throw new BadRequestException("You must be logged in to create a paste on this instance.");
    }

    const id = pasteBody.paranoid ? generateParanoidId() : generateContentId();
    const paste = this.pasteRepo.create({
      ...pasteBody,
      owner: request.user,
      id: id,
    });

    await this.pasteRepo.persistAndFlush(paste);
    return paste;
  }

  @Get(":pasteId")
  async get(@Param("pasteId") pasteId: string) {
    return this.pasteService.getPaste(pasteId);
  }

  @Post(":pasteId/burn")
  @HttpCode(204)
  async burn(@Param("pasteId") pasteId: string) {
    const burnt = await this.pasteRepo.nativeDelete({
      id: pasteId,
      burn: true,
    });

    if (burnt === 0) throw new NotFoundException();
  }
}
