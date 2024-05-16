import { BlobType, Entity, OneToOne, OptionalProps, Property, type Ref } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { FileEntity } from "../file/file.entity.js";

@Entity({ tableName: "thumbnails" })
@ObjectType("Thumbnail")
export class ThumbnailEntity {
  @OneToOne({ entity: () => FileEntity, inversedBy: "thumbnail", primary: true, ref: true, deleteRule: "CASCADE" })
  file: Ref<FileEntity>;

  @Property()
  @Field()
  size: number;

  @Property()
  @Field()
  duration: number;

  @Property()
  @Field()
  type: string;

  @Property()
  @Field()
  width: number;

  @Property()
  @Field()
  height: number;

  @Property({ type: BlobType, lazy: true, ref: true, hidden: true })
  data: Ref<Buffer>;

  @Property()
  @Field()
  createdAt: Date = new Date();

  [OptionalProps]: "createdAt";
}
