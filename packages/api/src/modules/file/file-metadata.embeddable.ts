import { Embeddable, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';

@Embeddable()
@ObjectType()
export class FileMetadata {
  @Property({ nullable: true, type: 'number' })
  @Field({ nullable: true })
  height?: number;

  @Property({ nullable: true, type: 'number' })
  @Field({ nullable: true })
  width?: number;
}
