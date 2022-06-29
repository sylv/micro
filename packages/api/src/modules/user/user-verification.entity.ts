import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { randomBytes } from 'crypto';
import { User } from './user.entity';

@Entity({ tableName: 'users_verification' })
export class UserVerification {
  @PrimaryKey()
  id: string = randomBytes(16).toString('hex');

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Property()
  expiresAt: Date;
}
