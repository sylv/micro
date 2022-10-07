import { Entity, type IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { generateContentId } from '../../helpers/generate-content-id.helper.js';
import { User } from '../user/user.entity.js';
import { Resource } from '../../helpers/resource.entity-base.js';

@Entity({ tableName: 'links' })
@ObjectType()
export class Link extends Resource {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateContentId();

  @Property({ length: 1024 })
  @Field()
  destination: string;

  @Property()
  @Field()
  clicks: number = 0;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @ManyToOne(() => User, { wrappedReference: true, hidden: true })
  @Exclude()
  owner: IdentifiedReference<User>;

  getPaths() {
    return {
      view: `/l/${this.id}`,
      direct: `/l/${this.id}`,
    };
  }

  [OptionalProps]: 'createdAt' | 'clicks';
}
