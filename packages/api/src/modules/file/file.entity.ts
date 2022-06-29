import {
  Embedded,
  Entity,
  IdentifiedReference,
  LoadStrategy,
  ManyToOne,
  OneToOne,
  OptionalProps,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { checkThumbnailSupport } from '@ryanke/thumbnail-generator';
import mimeType from 'mime-types';
import { generateDeleteKey } from '../../helpers/generate-delete-key.helper';
import { ResourceBase } from '../../resource.entity-base';
import { Thumbnail } from '../thumbnail/thumbnail.entity';
import { User } from '../user/user.entity';
import { FileMetadata } from './file-metadata.embeddable';

@Entity({ tableName: 'files' })
export class File extends ResourceBase {
  @PrimaryKey()
  id: string;

  @Property()
  type: string;

  @Property()
  size: number;

  @Property()
  hash: string;

  @Embedded(() => FileMetadata, { nullable: true })
  metadata?: FileMetadata;

  @Property({ lazy: true, nullable: true, hidden: true })
  deleteKey?: string = generateDeleteKey();

  @Property({ nullable: true })
  name?: string;

  @OneToOne({ entity: () => Thumbnail, nullable: true, eager: true, strategy: LoadStrategy.JOINED })
  thumbnail?: Thumbnail;

  @ManyToOne(() => User, {
    // todo: mikroorm should handle this for us, it should serialize the user to an { id }
    // object. instead it serializes it to a string which breaks types client-side.
    serializer: (value) => ({ id: value.id }),
    wrappedReference: true,
  })
  owner: IdentifiedReference<User>;

  @Property({ type: Date })
  createdAt = new Date();

  @Property({ persist: false })
  get extension() {
    return mimeType.extension(this.type) || 'bin';
  }

  @Property({ persist: false })
  get displayName() {
    const extension = this.extension;
    return this.name ? this.name : extension ? `${this.id}.${extension}` : this.id;
  }

  @Property({ persist: false })
  get paths() {
    const prefix = this.type.startsWith('video') ? '/v' : this.type.startsWith('image') ? '/i' : '/f';
    const viewPath = `${prefix}/${this.id}`;
    const directPath = `${prefix}/${this.id}.${this.extension}`;
    const metadataPath = `/api/file/${this.id}`;
    const thumbnailUrl = checkThumbnailSupport(this.type) ? `/t/${this.id}` : undefined;
    const deletePath = this.deleteKey ? `${prefix}/${this.id}/delete?key=${this.deleteKey}` : undefined;

    return {
      view: viewPath,
      direct: directPath,
      metadata: metadataPath,
      thumbnail: thumbnailUrl,
      delete: deletePath,
    };
  }

  [OptionalProps]: 'paths' | 'urls' | 'displayName' | 'createdAt' | 'thumbnail' | 'name' | 'deleteKey' | 'extension';
}
