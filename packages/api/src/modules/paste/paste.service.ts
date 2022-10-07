import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { FastifyRequest } from 'fastify';
import { Paste } from './paste.entity.js';

@Injectable()
export class PasteService {
  private readonly log = new Logger('PasteService');
  constructor(@InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>) {}

  async getPaste(pasteId: string, request: FastifyRequest) {
    const paste = await this.pasteRepo.findOneOrFail(pasteId, { populate: ['owner'] });
    if (!paste.canSendTo(request)) {
      throw new BadRequestException('Your paste is in another castle.');
    }

    if (paste.expiresAt && paste.expiresAt.getTime() < Date.now()) {
      await this.pasteRepo.removeAndFlush(paste);
      throw new NotFoundException();
    }

    return paste;
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteExpiredPastes() {
    const deleted = await this.pasteRepo.nativeDelete({
      expiresAt: {
        $lte: new Date(),
      },
    });

    if (deleted !== 0) {
      this.log.debug(`Deleted ${deleted} expired pastes`);
    }
  }
}
