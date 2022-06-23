import { EntityRepository, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import type { OnApplicationBootstrap } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { config } from '../../config';
import { Permission } from '../../constants';
import { User } from '../user/user.entity';
import { Invite } from './invite.entity';

export interface JWTPayloadInvite {
  id: string;
  inviter?: string;
  permissions?: number;
}

@Injectable()
export class InviteService implements OnApplicationBootstrap {
  private readonly logger = new Logger(InviteService.name);
  constructor(
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
    @InjectRepository(Invite) private readonly inviteRepo: EntityRepository<Invite>,
    protected orm: MikroORM
  ) {}

  async create(inviterId: string | null, permissions: Permission | null) {
    const invite = this.inviteRepo.create({
      inviter: inviterId,
      permissions: permissions,
    });

    await this.inviteRepo.persistAndFlush(invite);
    return invite;
  }

  async get(inviteId: string) {
    return this.inviteRepo.findOne(inviteId);
  }

  async consume(invite: Invite) {
    this.inviteRepo.remove(invite);
    await this.inviteRepo.flush();
  }

  @UseRequestContext()
  async onApplicationBootstrap() {
    const users = await this.userRepo.count();
    if (users >= 1) return;
    const existing = await this.inviteRepo.findOne({ inviter: null, permissions: Permission.ADMINISTRATOR });
    if (existing) {
      this.logger.log(`Go to ${config.rootHost.url}${existing.url} to create the first account.`);
      return;
    }

    const invite = await this.create(null, Permission.ADMINISTRATOR);
    this.logger.log(`Go to ${config.rootHost.url}${invite.url} to create the first account.`);
  }
}
