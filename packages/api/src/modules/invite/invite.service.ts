import { EntityManager, EntityRepository, MikroORM, ref, CreateRequestContext } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import type { OnApplicationBootstrap } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import { Permission } from "../../constants.js";
import { User } from "../user/user.entity.js";
import { Invite } from "./invite.entity.js";

export interface JWTPayloadInvite {
  id: string;
  inviter?: string;
  permissions?: number;
}

@Injectable()
export class InviteService implements OnApplicationBootstrap {
  @InjectRepository(User) private readonly userRepo: EntityRepository<User>;
  @InjectRepository(Invite) private readonly inviteRepo: EntityRepository<Invite>;

  private readonly logger = new Logger(InviteService.name);
  constructor(
    protected orm: MikroORM,
    private em: EntityManager,
  ) {}

  async create(inviterId: string | null, permissions: Permission | null, extra?: Partial<Invite>) {
    const invite = this.inviteRepo.create({
      inviter: inviterId || undefined,
      permissions: permissions || undefined,
    });

    await this.em.persistAndFlush(invite);
    return invite;
  }

  async get(inviteId: string) {
    return this.inviteRepo.findOne(inviteId);
  }

  async consume(invite: Invite, user: User) {
    invite.invited = ref(user);
    if (invite.skipVerification) {
      user.verifiedEmail = true;
      this.em.persist(user);
    }

    await this.em.persistAndFlush(invite);
  }

  @CreateRequestContext()
  async onApplicationBootstrap() {
    const users = await this.userRepo.count();
    if (users >= 1) return;
    const existing = await this.inviteRepo.findOne({ inviter: null, permissions: Permission.ADMINISTRATOR });
    if (existing) {
      this.logger.log(`Go to ${existing.url} to create the first account.`);
      return;
    }

    const invite = await this.create(null, Permission.ADMINISTRATOR, { skipVerification: true });
    this.logger.log(`Go to ${invite.url} to create the first account.`);
  }
}
