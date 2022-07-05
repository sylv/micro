import {
  Embedded,
  Entity,
  IdentifiedReference,
  Index,
  LoadStrategy,
  ManyToOne,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { checkThumbnailSupport } from '@ryanke/thumbnail-generator';
import { Exclude } from 'class-transformer';
import mimeType from 'mime-types';
import { generateDeleteKey } from '../../helpers/generate-delete-key.helper';
import { Resource } from '../../helpers/resource.entity-base';
import { Paginated } from '../../types/paginated.type';
import { Thumbnail } from '../thumbnail/thumbnail.entity';
import { User } from '../user/user.entity';
import { FileMetadata } from './file-metadata.embeddable';

@Entity({ tableName: 'files' })
@ObjectType()
export class File extends Resource {
  @PrimaryKey()
  @Field(() => ID)
  id: string;

  @Property()
  @Field()
  type: string;

  @Property()
  @Field()
  size: number;

  @Property()
  @Field()
  hash: string;

  @Embedded(() => FileMetadata, { nullable: true })
  @Field(() => FileMetadata, { nullable: true })
  metadata?: FileMetadata;

  @Property({ lazy: true, nullable: true, hidden: true })
  deleteKey?: string = generateDeleteKey();

  @Property({ nullable: true })
  @Field({ nullable: true })
  name?: string;

  @OneToOne({ entity: () => Thumbnail, nullable: true, eager: true, strategy: LoadStrategy.JOINED })
  @Field(() => Thumbnail, { nullable: true })
  thumbnail?: Thumbnail;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @ManyToOne(() => User, { wrappedReference: true, hidden: true })
  @Exclude()
  @Index()
  owner: IdentifiedReference<User>;

  getExtension() {
    return mimeType.extension(this.type) || 'bin';
  }

  getDisplayName() {
    const extension = this.getExtension();
    return this.name ? this.name : extension ? `${this.id}.${extension}` : this.id;
  }

  getPaths() {
    const extension = this.getExtension();
    const prefix = this.type.startsWith('video') ? '/v' : this.type.startsWith('image') ? '/i' : '/f';
    const viewPath = `${prefix}/${this.id}`;
    const directPath = `${prefix}/${this.id}.${extension}`;
    const thumbnailUrl = checkThumbnailSupport(this.type) ? `/t/${this.id}` : undefined;
    const deletePath = this.deleteKey ? `${prefix}/${this.id}/delete?key=${this.deleteKey}` : undefined;

    return {
      view: viewPath,
      direct: directPath,
      thumbnail: thumbnailUrl,
      delete: deletePath,
    };
  }

  [OptionalProps]: 'createdAt';
}

@ObjectType()
export class FilePage extends Paginated(File) {}
