import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { UseGuards } from "@nestjs/common";
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { ResourceLocations } from "../../types/resource-locations.type.js";
import { UserId } from "../auth/auth.decorators.js";
import { JWTAuthGuard } from "../auth/guards/jwt.guard.js";
import { HostService } from "../host/host.service.js";
import { UserService } from "../user/user.service.js";
import { LinkEntity } from "./link.entity.js";
import { EntityManager } from "@mikro-orm/core";

@Resolver(() => LinkEntity)
export class LinkResolver {
  @InjectRepository(LinkEntity) private linkRepo: EntityRepository<LinkEntity>;

  constructor(
    private userService: UserService,
    private hostService: HostService,
    private readonly em: EntityManager,
  ) {}

  @Query(() => LinkEntity)
  async link(@Args("linkId", { type: () => ID }) linkId: string) {
    return this.linkRepo.findOneOrFail(linkId);
  }

  @Mutation(() => LinkEntity)
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
  paths(@Parent() link: LinkEntity) {
    return link.getPaths();
  }

  @ResolveField(() => ResourceLocations)
  urls(@Parent() link: LinkEntity) {
    return link.getUrls();
  }
}
