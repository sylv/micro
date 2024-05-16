import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ResourceLocations } from "../../types/resource-locations.type.js";
import { UserId } from "../auth/auth.decorators.js";
import { JWTAuthGuard } from "../auth/guards/jwt.guard.js";
import { HostService } from "../host/host.service.js";
import { UserService } from "../user/user.service.js";
import { Link } from "./link.entity.js";
import { EntityManager } from "@mikro-orm/core";

@Resolver(() => Link)
export class LinkResolver {
  @InjectRepository(Link) private readonly linkRepo: EntityRepository<Link>;

  constructor(
    private readonly userService: UserService,
    private readonly hostService: HostService,
    private readonly em: EntityManager,
  ) {}

  @Query(() => Link)
  async link(@Args("linkId", { type: () => ID }) linkId: string) {
    return this.linkRepo.findOneOrFail(linkId);
  }

  @Mutation(() => Link)
  @UseGuards(JWTAuthGuard)
  async createLink(
    @UserId() userId: string,
    @Args("destination") destination: string,
    @Args("host", { nullable: true }) host?: string,
  ) {
    const user = await this.userService.getUser(userId, true);
    const resolvedHost = host ? this.hostService.resolveUploadHost(host, user) : undefined;
    const link = this.linkRepo.create({
      destination: destination,
      owner: userId,
      hostname: resolvedHost?.normalised,
    });

    await this.em.persistAndFlush(link);
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
