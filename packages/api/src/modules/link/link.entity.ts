import { Entity, IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { ResourceBase } from '../../resource.entity-base';
import { User } from '../user/user.entity';

@Entity({ tableName: 'links' })
export class Link extends ResourceBase {
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

  @Property({ persist: false })
  get paths() {
    return {
      view: `/l/${this.id}`,
      direct: `/l/${this.id}`,
    };
  }

  [OptionalProps]: 'hostname' | 'clicks' | 'createdAt' | 'paths' | 'urls';
}
