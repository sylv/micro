import { Entity, IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { WithHostname } from '../host/host.entity';
import { User } from '../user/user.entity';

@Entity({ tableName: 'links' })
export class Link extends WithHostname {
  @PrimaryKey()
  id: string = generateContentId();

  @Property({ length: 1024 })
  destination: string;

  @Property()
  clicks: number = 0;

  @Property({ type: Date })
  createdAt = new Date();

  @ManyToOne(() => User, {
    hidden: true,
    wrappedReference: true,
  })
  owner: IdentifiedReference<User>;

  [OptionalProps]: 'hostname' | 'clicks' | 'createdAt';
}
