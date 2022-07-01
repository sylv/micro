import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ResourceLocations } from '../../types/resource-locations.type';
import { UserId } from '../auth/auth.decorators';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { HostService } from '../host/host.service';
import { UserService } from '../user/user.service';
import { Link } from './link.entity';

@Resolver(() => Link)
export class LinkResolver {
  constructor(
    @InjectRepository(Link) private readonly linkRepo: EntityRepository<Link>,
    private readonly userService: UserService,
    private readonly hostService: HostService
  ) {}

  @Query(() => Link)
  async link(@Args('linkId', { type: () => ID }) linkId: string) {
    return this.linkRepo.findOneOrFail(linkId);
  }

  @Mutation(() => Link)
  @UseGuards(JWTAuthGuard)
  async createLink(
    @UserId() userId: string,
    @Args('destination') destination: string,
    @Args('host', { nullable: true }) host?: string
  ) {
    const user = await this.userService.getUser(userId, true);
    const resolvedHost = host ? this.hostService.resolveUploadHost(host, user) : undefined;
    const link = this.linkRepo.create({
      destination: destination,
      owner: userId,
      hostname: resolvedHost?.normalised,
    });

    await this.linkRepo.persistAndFlush(link);
    return link;
  }

  @ResolveField(() => ResourceLocations)
  paths(@Parent() link: Link) {
    return link.getPaths();
  }

  @ResolveField(() => ResourceLocations)
  urls(@Parent() link: Link) {
    return link.getUrls();
  }
}
