import { resolveSelections } from "@jenyus-org/graphql-utils";
import { EntityManager } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { ForbiddenException, NotFoundException, UseGuards } from "@nestjs/common";
import { Args, Context, ID, Info, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import prettyBytes from "pretty-bytes";
import isValidUtf8 from "utf-8-validate";
import { getRequestFromGraphQLContext } from "../../helpers/get-request.js";
import { isLikelyBinary } from "../../helpers/is-likely-binary.js";
import { ResourceLocations } from "../../types/resource-locations.type.js";
import { UserId } from "../auth/auth.decorators.js";
import { OptionalJWTAuthGuard } from "../auth/guards/optional-jwt.guard.js";
import { StorageService } from "../storage/storage.service.js";
import { ThumbnailEntity } from "../thumbnail/thumbnail.entity.js";
import { FileEntity } from "./file.entity.js";

@Resolver(() => FileEntity)
export class FileResolver {
  @InjectRepository(FileEntity) private fileRepo: EntityRepository<FileEntity>;

  private static readonly MAX_PREVIEWABLE_TEXT_SIZE = 1 * 1024 * 1024; // 1 MB
  constructor(
    private storageService: StorageService,
    private em: EntityManager,
  ) {}

  @Query(() => FileEntity)
  @UseGuards(OptionalJWTAuthGuard)
  async file(@Context() context: any, @Args("fileId", { type: () => ID }) fileId: string, @Info() info: any) {
    const populate = resolveSelections([{ field: "urls", selector: "owner" }], info) as any[];
    const file = await this.fileRepo.findOneOrFail(fileId, {
      populate,
    });

    const request = getRequestFromGraphQLContext(context);
    if (!file.canSendTo(request)) {
      throw new NotFoundException("Your file is in another castle.");
    }

    return file;
  }

  @Mutation(() => Boolean)
  @UseGuards(OptionalJWTAuthGuard) // necessary for file.isOwner
  async deleteFile(
    @UserId() userId: string,
    @Args("fileId", { type: () => ID }) fileId: string,
    @Args("key", { nullable: true }) deleteKey?: string,
  ) {
    const file = await this.fileRepo.findOneOrFail(fileId, { populate: ["deleteKey"] });
    if (file.owner.id !== userId && (!deleteKey || file.deleteKey !== deleteKey)) {
      throw new ForbiddenException("You are not allowed to delete this file");
    }

    await this.em.removeAndFlush(file);
    return true;
  }

  @ResolveField(() => String, { nullable: true })
  async textContent(@Parent() file: FileEntity) {
    if (file.isUtf8 === false) return null;
    if (file.size > FileResolver.MAX_PREVIEWABLE_TEXT_SIZE) return null;
    if (isLikelyBinary(file.type)) return null;

    const stream = await this.storageService.createReadStream(file);
    const chunks = [];
    for await (const chunk of stream) {
      const isUtf8 = isValidUtf8(chunk);
      if (!isUtf8) {
        const ref = this.fileRepo.getReference(file.id);
        ref.isUtf8 = false;
        await this.em.persistAndFlush(ref);
        return null;
      }

      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    return buffer.toString();
  }

  @ResolveField(() => String)
  displayName(@Parent() file: FileEntity) {
    return file.getDisplayName();
  }

  @ResolveField(() => ResourceLocations)
  paths(@Parent() file: FileEntity) {
    return file.getPaths();
  }

  @ResolveField(() => ResourceLocations)
  urls(@Parent() file: FileEntity) {
    return file.getUrls();
  }

  @ResolveField(() => String)
  sizeFormatted(@Parent() file: FileEntity) {
    return prettyBytes(file.size);
  }

  @ResolveField(() => Boolean)
  isOwner(@Parent() file: FileEntity, @UserId() userId?: string) {
    return file.owner.id === userId;
  }

  @ResolveField(() => ThumbnailEntity, { nullable: true })
  thumbnail(@Parent() file: FileEntity) {
    return file.thumbnail?.getEntity();
  }
}
