import {
  ArrayType,
  Collection,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { File } from '../file/file.entity';
import { Invite } from '../invite/invite.entity';
import { UserVerification } from './user-verification.entity';

@Entity({ tableName: 'users' })
@ObjectType()
export class User {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateContentId();

  @Property({ unique: true, index: true, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Property({ default: false })
  @Field()
  verifiedEmail: boolean;

  @Property({ unique: true, index: true })
  @Field()
  @Index()
  username: string;

  @Property()
  @Field()
  permissions: number = 0;

  @Property({ hidden: true })
  @Exclude()
  password: string;

  @Property({ hidden: true })
  @Index()
  secret: string;

  @OneToOne({ nullable: true })
  invite?: Invite;

  @Property()
  @Field(() => [String])
  tags: string[] = [];

  @OneToMany(() => File, (file) => file.owner, { orphanRemoval: true, hidden: true })
  @Exclude()
  files = new Collection<File>(this);

  @Exclude()
  @OneToMany(() => UserVerification, (verification) => verification.user, {
    orphanRemoval: true,
    persist: true,
    hidden: true,
  })
  verifications = new Collection<UserVerification>(this);

  @Exclude()
  @Property({ nullable: true, hidden: true })
  otpSecret?: string;

  @Field()
  @Property({ default: false, hidden: true })
  otpEnabled: boolean;

  @Exclude()
  @Property({ nullable: true, hidden: true, type: ArrayType })
  otpRecoveryCodes?: string[];

  [OptionalProps]: 'permissions' | 'tags' | 'verifiedEmail';
}
