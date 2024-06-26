import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { Args, ID, Info, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { generateContentId, generateParanoidId } from "../../helpers/generate-content-id.helper.js";
import { ResourceLocations } from "../../types/resource-locations.type.js";
import { UserId } from "../auth/auth.decorators.js";
import { JWTAuthGuard } from "../auth/guards/jwt.guard.js";
import { OptionalJWTAuthGuard } from "../auth/guards/optional-jwt.guard.js";
import { HostService } from "../host/host.service.js";
import { UserService } from "../user/user.service.js";
import { CreatePasteDto, PasteEntity } from "./paste.entity.js";
import { resolveSelections, hasFields } from "@jenyus-org/graphql-utils";
import { EntityManager } from "@mikro-orm/core";

@Resolver(() => PasteEntity)
export class PasteResolver {
  @InjectRepository(PasteEntity) private pasteRepo: EntityRepository<PasteEntity>;

  constructor(
    private userService: UserService,
    private hostService: HostService,
    private em: EntityManager,
  ) {}

  @Query(() => PasteEntity)
  @UseGuards(OptionalJWTAuthGuard)
  async paste(
    @UserId() userId: string,
    @Info() info: any,
    @Args("pasteId", { type: () => ID }) pasteId: string,
  ): Promise<PasteEntity> {
    const populate = resolveSelections([{ field: "urls", selector: "owner" }, "content"], info) as any[];
    const paste = await this.pasteRepo.findOneOrFail(pasteId, { populate });

    // if the owner is viewing the paste, don't burn it
    // otherwise, set that bitch alight
    const isOwner = paste.owner?.id === userId;
    const wantsContent = hasFields(info, "paste.content");
    if (paste.burn && !isOwner && wantsContent) {
      await this.em.removeAndFlush(paste);
      paste.burnt = true;
    }

    return paste;
  }

  @Mutation(() => PasteEntity)
  @UseGuards(JWTAuthGuard)
  async createPaste(@UserId() userId: string, @Args("partial") body: CreatePasteDto) {
    const user = await this.userService.getUser(userId, true);
    const host = body.hostname ? this.hostService.resolveUploadHost(body.hostname, user) : undefined;
    const id = body.paranoid ? generateParanoidId() : generateContentId();

    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
    if (expiresAt && expiresAt.getTime() < Date.now() + 1000) {
      throw new BadRequestException("Paste expiry must be in the future or unset");
    }

    const paste = this.pasteRepo.create({
      ...body,
      expiresAt: expiresAt,
      owner: user,
      hostname: host?.normalised,
      id: id,
    });

    await this.em.persistAndFlush(paste);
    return paste;
  }

  @ResolveField(() => String)
  type(@Parent() paste: PasteEntity) {
    return paste.getType();
  }

  @ResolveField(() => ResourceLocations)
  paths(@Parent() paste: PasteEntity) {
    return paste.getPaths();
  }

  @ResolveField(() => ResourceLocations)
  urls(@Parent() paste: PasteEntity) {
    return paste.getUrls();
  }
}
