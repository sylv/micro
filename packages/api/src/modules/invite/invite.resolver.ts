import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permission } from '../../constants';
import { RequirePermissions, UserId } from '../auth/auth.decorators';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { Invite } from './invite.entity';

@Resolver(() => Invite)
export class InviteResolver {
  constructor(@InjectRepository(Invite) private readonly inviteRepo: EntityRepository<Invite>) {}

  @Query(() => Invite)
  async invite(@Args('inviteId', { type: () => ID }) inviteId: string) {
    return this.inviteRepo.findOneOrFail(inviteId);
  }

  @Mutation(() => Invite)
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() inviterId: string) {
    const invite = this.inviteRepo.create({
      inviter: inviterId,
    });

    await this.inviteRepo.persistAndFlush(invite);
    return invite;
  }
}
