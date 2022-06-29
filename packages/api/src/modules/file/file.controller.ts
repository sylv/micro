import type { MultipartFile } from '@fastify/multipart';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Controller,
  Delete,
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
import { FastifyReply, FastifyRequest } from 'fastify';
import { config } from '../../config';
import { UserId } from '../auth/auth.decorators';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { HostService } from '../host/host.service';
import { LinkService } from '../link/link.service';
import { Paste } from '../paste/paste.entity';
import { UserService } from '../user/user.service';
import { FileService } from './file.service';

@Controller()
export class FileController {
  constructor(
    @InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    private readonly hostService: HostService,
    private readonly linkService: LinkService
  ) {}

  @Get('file/:fileId/content')
  async getFileContent(
    @Res() reply: FastifyReply,
    @Param('fileId') fileId: string,
    @Request() request: FastifyRequest
  ) {
    return this.fileService.sendFile(fileId, request, reply);
  }

  @Get('file/:fileId')
  async getFile(@Res() reply: FastifyReply, @Param('fileId') fileId: string, @Request() request: FastifyRequest) {
    const file = await this.fileService.getFile(fileId, request);
    return reply.send(file);
  }

  @Delete('file/:fileId')
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param('fileId') fileId: string, @UserId() userId: string) {
    await this.fileService.deleteFile(fileId, userId);
    return { deleted: true };
  }

  @Get('file/:fileId/delete')
  async deleteFileByKey(@Param('fileId') fileId: string, @Param('key') deleteKey: string) {
    await this.fileService.deleteFile(fileId, null, deleteKey);
    return { deleted: true };
  }

  @Post('file')
  @UseGuards(JWTAuthGuard)
  async createFile(
    @UserId() userId: string,
    @Req() request: FastifyRequest,
    @Headers('X-Micro-Paste-Shortcut') shortcut: string,
    @Headers('x-micro-host') hosts = config.rootHost.url,
    @Query('input') input?: string
  ) {
    const user = await this.userService.getUser(userId, true);
    const host = this.hostService.resolveUploadHost(hosts, user);
    if (input && input.startsWith('http')) {
      // sharex will send urls to shorten as the "input" query param
      const link = await this.linkService.createLink(input, user.id, host);
      return {
        id: link.id,
        urls: link.urls,
        paths: link.paths,
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
        urls: paste.urls,
        paths: paste.paths,
      };
    }

    const file = await this.fileService.createFile(upload, request, user, host);
    return {
      id: file.id,
      urls: file.urls,
      paths: file.paths,
    };
  }
}
