import { HasFields, Selections } from '@jenyus-org/nestjs-graphql-utils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { generateContentId, generateParanoidId } from '../../helpers/generate-content-id.helper';
import { ResourceLocations } from '../../types/resource-locations.type';
import { UserId } from '../auth/auth.decorators';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { OptionalJWTAuthGuard } from '../auth/guards/optional-jwt.guard';
import { HostService } from '../host/host.service';
import { UserService } from '../user/user.service';
import { CreatePasteDto, Paste } from './paste.entity';

@Resolver(() => Paste)
export class PasteResolver {
  constructor(
    @InjectRepository(Paste) private readonly pasteRepo: EntityRepository<Paste>,
    private readonly userService: UserService,
    private readonly hostService: HostService
  ) {}

  @Query(() => Paste)
  @UseGuards(OptionalJWTAuthGuard)
  async paste(
    @UserId() userId: string,
    @HasFields('paste.content') wantsContent: boolean,
    @Args('pasteId', { type: () => ID }) pasteId: string,
    @Selections([{ field: 'urls', selector: 'owner' }, 'content']) populate?: any[]
  ): Promise<Paste> {
    const paste = await this.pasteRepo.findOneOrFail(pasteId, { populate });

    // if the owner is viewing the paste, don't burn it
    // otherwise, set that bitch alight
    const isOwner = paste.owner?.id === userId;
    if (paste.burn && !isOwner && wantsContent) {
      await this.pasteRepo.removeAndFlush(paste);
      paste.burnt = true;
    }

    return paste;
  }

  @Mutation(() => Paste)
  @UseGuards(JWTAuthGuard)
  async createPaste(@UserId() userId: string, @Args('partial') body: CreatePasteDto) {
    const user = await this.userService.getUser(userId, true);
    const host = body.hostname ? this.hostService.resolveUploadHost(body.hostname, user) : undefined;
    const id = body.paranoid ? generateParanoidId() : generateContentId();

    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
    if (expiresAt && expiresAt.getTime() < Date.now() + 1000) {
      throw new BadRequestException('Paste expiry must be in the future or unset');
    }

    const paste = this.pasteRepo.create({
      ...body,
      expiresAt: expiresAt,
      owner: user,
      hostname: host?.normalised,
      id: id,
    });

    await this.pasteRepo.persistAndFlush(paste);
    return paste;
  }

  @ResolveField(() => String)
  type(@Parent() paste: Paste) {
    return paste.getType();
  }

  @ResolveField(() => ResourceLocations)
  paths(@Parent() paste: Paste) {
    return paste.getPaths();
  }

  @ResolveField(() => ResourceLocations)
  urls(@Parent() paste: Paste) {
    return paste.getUrls();
  }
}
