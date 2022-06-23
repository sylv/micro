import { wrap } from '@mikro-orm/core';
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ThumbnailService } from './thumbnail.service';

@Controller()
export class ThumbnailController {
  constructor(private readonly thumbnailService: ThumbnailService) {}

  @Get('thumbnail/:fileId')
  async getThumbnail(@Param('fileId') fileId: string, @Res() reply: FastifyReply) {
    const thumbnail = await this.thumbnailService.getThumbnail(fileId);
    return reply.status(200).send(wrap(thumbnail).toPOJO());
  }

  @Get('thumbnail/:fileId/content')
  async getThumbnailContent(
    @Param('fileId') fileId: string,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply
  ) {
    return this.thumbnailService.sendThumbnail(fileId, request, reply);
  }
}
