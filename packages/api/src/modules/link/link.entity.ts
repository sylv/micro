import { Entity, IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { User } from '../user/user.entity';
import { Resource } from '../../helpers/resource.entity-base';

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
