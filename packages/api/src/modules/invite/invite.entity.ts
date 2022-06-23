import { Entity, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { generateDeleteKey } from '../../helpers/generate-delete-key.helper';
import { User } from '../user/user.entity';

@Entity({ tableName: 'invites' })
export class Invite {
  @PrimaryKey()
  id: string = generateDeleteKey();

  @Property({ nullable: true })
  permissions?: number;

  @ManyToOne({ entity: () => User, nullable: true })
  inviter?: User;

  @OneToOne({ entity: () => User, nullable: true })
  invited?: User;

  @Property({ type: Date })
  createdAt = new Date();

  @Property({ nullable: true })
  expiresAt?: Date;

  @Property({ persist: false })
  get expired() {
    return this.expiresAt && this.expiresAt.getTime() < Date.now();
  }

  @Property({ persist: false })
  get url() {
    return `/invite/${this.id}`;
  }

  [OptionalProps]: 'expiresAt' | 'createdAt' | 'invited' | 'inviter' | 'permissions' | 'expired' | 'url';
}
