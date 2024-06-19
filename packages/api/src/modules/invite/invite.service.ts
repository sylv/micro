import { EntityManager, EntityRepository, MikroORM, ref, CreateRequestContext } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import type { OnApplicationBootstrap } from "@nestjs/common";
import { Injectable, Logger } from "@nestjs/common";
import { Permission } from "../../constants.js";
import { UserEntity } from "../user/user.entity.js";
import { InviteEntity } from "./invite.entity.js";

@Injectable()
export class InviteService implements OnApplicationBootstrap {
  @InjectRepository(UserEntity) private userRepo: EntityRepository<UserEntity>;
  @InjectRepository(InviteEntity) private inviteRepo: EntityRepository<InviteEntity>;

  private readonly logger = new Logger(InviteService.name);
  constructor(
    protected orm: MikroORM,
    private em: EntityManager,
  ) {}

  async create(inviterId: string | null, permissions: Permission | null, extra?: Partial<InviteEntity>) {
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

  async consume(invite: InviteEntity, user: UserEntity) {
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
