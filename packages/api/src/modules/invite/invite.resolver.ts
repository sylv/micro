import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Permission } from "../../constants.js";
import { RequirePermissions, UserId } from "../auth/auth.decorators.js";
import { JWTAuthGuard } from "../auth/guards/jwt.guard.js";
import { InviteEntity } from "./invite.entity.js";
import { EntityManager } from "@mikro-orm/core";

@Resolver(() => InviteEntity)
export class InviteResolver {
  @InjectRepository(InviteEntity) private inviteRepo: EntityRepository<InviteEntity>;
  constructor(private em: EntityManager) {}

  @Query(() => InviteEntity)
  async invite(@Args("inviteId", { type: () => ID }) inviteId: string) {
    return this.inviteRepo.findOneOrFail(inviteId);
  }

  @Mutation(() => InviteEntity)
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() inviterId: string) {
    const invite = this.inviteRepo.create({
      inviter: inviterId,
    });

    await this.em.persistAndFlush(invite);
    return invite;
  }
}
