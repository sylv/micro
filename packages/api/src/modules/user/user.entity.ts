import { Collection, Entity, OneToMany, OneToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { File } from '../file/file.entity';
import { Invite } from '../invite/invite.entity';
import { UserVerification } from './user-verification.entity';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: string = generateContentId();

  @Property({ unique: true, index: true, nullable: true })
  email?: string;

  @Property({ default: false })
  verifiedEmail: boolean;

  @Property({ unique: true, index: true })
  username: string;

  @Property()
  permissions: number = 0;

  @Property({ hidden: true })
  @Exclude()
  password: string;

  @Property({ hidden: true })
  secret: string;

  @OneToOne({ nullable: true })
  invite?: Invite;

  @Property()
  tags: string[] = [];

  @OneToMany(() => File, (file) => file.owner, { orphanRemoval: true, hidden: true })
  @Exclude()
  files = new Collection<File>(this);

  @OneToMany(() => UserVerification, (verification) => verification.user, {
    orphanRemoval: true,
    persist: true,
    hidden: true,
  })
  @Exclude()
  verifications = new Collection<UserVerification>(this);

  [OptionalProps]: 'permissions' | 'tags' | 'verifiedEmail';
}
