import { Entity, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property, type Ref } from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { config } from '../../config.js';
import { generateDeleteKey } from '../../helpers/generate-delete-key.helper.js';
import { User } from '../user/user.entity.js';

@Entity({ tableName: 'invites' })
@ObjectType()
export class Invite {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateDeleteKey();

  @Property({ nullable: true })
  @Field({ nullable: true })
  permissions?: number;

  @ManyToOne({ entity: () => User, ref: true, nullable: true })
  inviter?: Ref<User>;

  @OneToOne({ entity: () => User, ref: true, nullable: true })
  invited?: Ref<User>;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property()
  @Field()
  skipVerification: boolean = false;

  @Property({ nullable: true })
  @Field({ nullable: true })
  expiresAt?: Date;

  @Property({ persist: false })
  @Field(() => Boolean)
  get expired() {
    return this.expiresAt && this.expiresAt.getTime() < Date.now();
  }

  @Property({ persist: false })
  @Field(() => Boolean)
  get consumed() {
    return !!this.invited;
  }

  @Property({ persist: false })
  @Field(() => String)
  get path() {
    return `/invite/${this.id}`;
  }

  @Property({ persist: false })
  @Field(() => String)
  get url() {
    const url = new URL(config.rootHost.url);
    url.pathname = this.path;
    return url;
  }

  [OptionalProps]: 'url' | 'path' | 'consumed' | 'expired' | 'createdAt' | 'skipVerification';
}
