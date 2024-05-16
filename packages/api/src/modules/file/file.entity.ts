import { Embedded, Entity, Index, LoadStrategy, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property, type Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import mimeType from "mime-types";
import { generateDeleteKey } from "../../helpers/generate-delete-key.helper.js";
import { ResourceEntity } from "../../helpers/resource.entity-base.js";
import { Paginated } from "../../types/paginated.type.js";
import { ThumbnailEntity } from "../thumbnail/thumbnail.entity.js";
import { ThumbnailService } from "../thumbnail/thumbnail.service.js";
import { UserEntity } from "../user/user.entity.js";
import { FileMetadata } from "./file-metadata.embeddable.js";

@Entity({ tableName: "files" })
@ObjectType("File")
export class FileEntity extends ResourceEntity {
  @PrimaryKey()
  @Field(() => ID)
  id: string;

  @Property()
  @Field()
  type: string;

  @Property()
  @Field()
  size: number;

  @Property()
  @Field()
  hash: string;

  @Property({ nullable: true })
  isUtf8?: boolean;

  @Embedded(() => FileMetadata, { nullable: true })
  @Field(() => FileMetadata, { nullable: true })
  metadata?: FileMetadata;

  @Property({ lazy: true, nullable: true, hidden: true })
  deleteKey?: string = generateDeleteKey();

  @Property({ nullable: true })
  @Field({ nullable: true })
  name?: string;

  @Property()
  views: number = 0;

  @Property()
  @Field()
  external: boolean = false;

  @Property({ nullable: true })
  externalError?: string;

  @Field(() => ThumbnailEntity, { nullable: true })
  @OneToOne(
    () => ThumbnailEntity,
    (thumbnail) => thumbnail.file,
    { nullable: true, eager: true, ref: true, strategy: LoadStrategy.JOINED },
  )
  thumbnail?: Ref<ThumbnailEntity>;

  @Property({ nullable: true })
  thumbnailError?: string;

  @ManyToOne(() => UserEntity, { ref: true, hidden: true })
  @Exclude()
  @Index()
  owner: Ref<UserEntity>;

  @Property()
  @Field()
  createdAt: Date = new Date();

  getExtension() {
    return mimeType.extension(this.type) || "bin";
  }

  getDisplayName() {
    if (this.name) return this.name;
    const extension = this.getExtension();
    if (extension) {
      return `${this.id}.${extension}`;
    }

    return this.id;
  }

  getPaths() {
    const extension = this.getExtension();
    const prefix = this.type.startsWith("video") ? "/v" : this.type.startsWith("image") ? "/i" : "/f";
    const viewPath = `${prefix}/${this.id}`;
    const directPath = `${prefix}/${this.id}.${extension}`;
    const thumbnailUrl = ThumbnailService.checkSupport(this.type) ? `/t/${this.id}` : undefined;
    const deletePath = this.deleteKey ? `${prefix}/${this.id}?deleteKey=${this.deleteKey}` : undefined;

    return {
      view: viewPath,
      direct: directPath,
      thumbnail: thumbnailUrl,
      delete: deletePath,
    };
  }

  [OptionalProps]: "createdAt" | "views" | "external";
}

@ObjectType()
export class FilePage extends Paginated(FileEntity) {}
