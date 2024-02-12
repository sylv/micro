import type { MultipartFile } from '@fastify/multipart';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { rootHost } from '../../config.js';
import { UserId } from '../auth/auth.decorators.js';
import { JWTAuthGuard } from '../auth/guards/jwt.guard.js';
import { HostService } from '../host/host.service.js';
import { LinkService } from '../link/link.service.js';
import { Paste } from '../paste/paste.entity.js';
import { UserService } from '../user/user.service.js';
import { FileService } from './file.service.js';

@Controller()
export class FileController {
  constructor(
    @InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly hostService: HostService,
    private readonly linkService: LinkService,
  ) {}

  @Get('file/:fileId')
  async getFileContent(
    @Res() reply: FastifyReply,
    @Param('fileId') fileId: string,
    @Request() request: FastifyRequest,
  ) {
    return this.fileService.sendFile(fileId, request, reply);
  }

  @Post('file')
  @UseGuards(JWTAuthGuard)
  async createFile(
    @UserId() userId: string,
    @Req() request: FastifyRequest,
    @Headers('X-Micro-Paste-Shortcut') shortcut: string,
    @Headers('x-micro-host') hosts = rootHost.url,
    @Query('input') input?: string,
  ) {
    const user = await this.userService.getUser(userId, true);
    const host = this.hostService.resolveUploadHost(hosts, user);
    if (input && input.startsWith('http')) {
      // sharex will send urls to shorten as the "input" query param
      const link = await this.linkService.createLink(input, user.id, host);
      return {
        id: link.id,
        hostname: link.hostname,
        urls: link.getUrls(),
        paths: link.getPaths(),
      };
    }

    const upload = (await request.file()) as MultipartFile | undefined;
    if (!upload) {
      throw new BadRequestException('Missing upload.');
    }

    if (shortcut === 'true' && upload.mimetype === 'text/plain') {
      // shortcut text uploads to a paste
      const content = await upload.toBuffer();
      const paste = this.pasteRepo.create({
        content: content.toString(),
        burn: false,
        encrypted: false,
        owner: userId,
        extension: 'txt',
        hostname: host?.normalised,
      });

      await this.pasteRepo.persistAndFlush(paste);
      return {
        id: paste.id,
        hostname: paste.hostname,
        urls: paste.getUrls(),
        paths: paste.getPaths(),
      };
    }

    const file = await this.fileService.createFile(upload, request, user, host);
    return {
      id: file.id,
      hostname: file.hostname,
      urls: file.getUrls(),
      paths: file.getPaths(),
    };
  }
}
