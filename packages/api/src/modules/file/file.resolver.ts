import { resolveSelections } from '@jenyus-org/graphql-utils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, ID, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import prettyBytes from 'pretty-bytes';
import { ResourceLocations } from '../../types/resource-locations.type.js';
import { UserId } from '../auth/auth.decorators.js';
import { OptionalJWTAuthGuard } from '../auth/guards/optional-jwt.guard.js';
import { File } from './file.entity.js';

@Resolver(() => File)
export class FileResolver {
  constructor(@InjectRepository(File) private readonly fileRepo: EntityRepository<File>) {}

  @Query(() => File)
  @UseGuards(OptionalJWTAuthGuard)
  async file(@Args('fileId', { type: () => ID }) fileId: string, @Info() info: any) {
    const populate = resolveSelections([{ field: 'urls', selector: 'owner' }], info) as any[];
    return this.fileRepo.findOneOrFail(fileId, {
      populate,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(OptionalJWTAuthGuard) // necessary for file.isOwner
  async deleteFile(
    @UserId() userId: string,
    @Args('fileId', { type: () => ID }) fileId: string,
    @Args('key', { nullable: true }) deleteKey?: string
  ) {
    const file = await this.fileRepo.findOneOrFail(fileId, { populate: ['deleteKey'] });
    if (file.owner.id !== userId && (!deleteKey || file.deleteKey !== deleteKey)) {
      throw new ForbiddenException('You are not allowed to delete this file');
    }

    await this.fileRepo.removeAndFlush(file);
    return true;
  }

  @ResolveField(() => String)
  displayName(@Parent() file: File) {
    return file.getDisplayName();
  }

  @ResolveField(() => ResourceLocations)
  paths(@Parent() file: File) {
    return file.getPaths();
  }

  @ResolveField(() => ResourceLocations)
  urls(@Parent() file: File) {
    return file.getUrls();
  }

  @ResolveField(() => String)
  sizeFormatted(@Parent() file: File) {
    return prettyBytes(file.size);
  }

  @ResolveField(() => Boolean)
  isOwner(@Parent() file: File, @UserId() userId?: string) {
    return file.owner.id === userId;
  }
}
