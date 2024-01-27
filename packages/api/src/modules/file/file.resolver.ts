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
import { StorageService } from '../storage/storage.service.js';
import isValidUtf8 from 'utf-8-validate';
import { isLikelyBinary } from '../../helpers/is-likely-binary.js';

@Resolver(() => File)
export class FileResolver {
  private static readonly MAX_PREVIEWABLE_TEXT_SIZE = 1 * 1024 * 1024; // 1 MB
  constructor(
    @InjectRepository(File) private readonly fileRepo: EntityRepository<File>,
    private storageService: StorageService,
  ) {}

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
    @Args('key', { nullable: true }) deleteKey?: string,
  ) {
    const file = await this.fileRepo.findOneOrFail(fileId, { populate: ['deleteKey'] });
    if (file.owner.id !== userId && (!deleteKey || file.deleteKey !== deleteKey)) {
      throw new ForbiddenException('You are not allowed to delete this file');
    }

    await this.fileRepo.removeAndFlush(file);
    return true;
  }

  @ResolveField(() => String, { nullable: true })
  async textContent(@Parent() file: File) {
    if (file.isUtf8 === false) return null;
    if (file.size > FileResolver.MAX_PREVIEWABLE_TEXT_SIZE) return null;
    if (isLikelyBinary(file.type)) return null;

    const stream = this.storageService.createReadStream(file.hash);
    const chunks = [];
    for await (const chunk of stream) {
      const isUtf8 = isValidUtf8(chunk);
      if (!isUtf8) {
        const ref = this.fileRepo.getReference(file.id);
        ref.isUtf8 = false;
        await this.fileRepo.persistAndFlush(ref);
        return null;
      }

      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    return buffer.toString();
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
