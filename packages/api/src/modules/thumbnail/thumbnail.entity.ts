import { BlobType, Entity, OneToOne, OptionalProps, Property, type Ref } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { File } from "../file/file.entity.js";

@Entity({ tableName: "thumbnails" })
@ObjectType()
export class Thumbnail {
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

  @Property({ type: BlobType, lazy: true, hidden: true })
  data: Buffer;

  @OneToOne({ entity: () => File, primary: true, ref: true, deleteRule: "CASCADE" })
  file: Ref<File>;

  @Property()
  @Field()
  createdAt: Date = new Date();

  [OptionalProps]: "createdAt";
}
