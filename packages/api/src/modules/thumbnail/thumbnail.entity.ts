import { BlobType, Entity, OneToOne, OptionalProps, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { File } from '../file/file.entity.js';

@Entity({ tableName: 'thumbnails' })
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

  @OneToOne({ entity: () => File, primary: true, onDelete: 'CASCADE' })
  file: File;

  @Property()
  @Field()
  createdAt: Date = new Date();

  [PrimaryKeyType]: string;
  [OptionalProps]: 'createdAt';
}
