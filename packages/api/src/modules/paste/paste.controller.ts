import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { config } from '../../config';
import { generateContentId, generateParanoidId } from '../../helpers/generate-content-id.helper';
import { UserId } from '../auth/auth.decorators';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { HostService } from '../host/host.service';
import { UserService } from '../user/user.service';
import { CreatePasteDto, Paste } from './paste.entity';
import { PasteService } from './paste.service';

@Controller('paste')
export class PasteController {
  constructor(
    @InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>,
    private readonly pasteService: PasteService,
    private readonly userService: UserService,
    private readonly hostService: HostService
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  async create(
    @UserId() userId: string,
    @Body() pasteBody: CreatePasteDto,
    @Req() request: FastifyRequest,
    @Headers('x-micro-host') hosts = config.rootHost.url
  ) {
    const user = await this.userService.getUser(userId, true);
    const host = this.hostService.resolveUploadHost(hosts, user);
    const id = pasteBody.paranoid ? generateParanoidId() : generateContentId();
    const expiresAt = pasteBody.expiresAt ? new Date(pasteBody.expiresAt) : undefined;
    if (expiresAt && expiresAt.getTime() < Date.now() + 1000) {
      throw new BadRequestException('Paste expiry must be in the future or unset');
    }

    const paste = this.pasteRepo.create({
      ...pasteBody,
      expiresAt: expiresAt,
      owner: request.user,
      hostname: host?.normalised,
      id: id,
    });

    await this.pasteRepo.persistAndFlush(paste);
    return paste;
  }

  @Get(':pasteId')
  async get(@Param('pasteId') pasteId: string, @Req() request: FastifyRequest) {
    return this.pasteService.getPaste(pasteId, request);
  }

  @Get(':pasteId/content')
  async getContent(@Param('pasteId') pasteId: string, @Req() request: FastifyRequest) {
    const file = await this.pasteService.getPaste(pasteId, request);
    return file.content;
  }

  @Post(':pasteId/burn')
  @HttpCode(204)
  async burn(@Param('pasteId') pasteId: string) {
    const burnt = await this.pasteRepo.nativeDelete({
      id: pasteId,
      burn: true,
    });

    if (burnt === 0) throw new NotFoundException();
  }
}
