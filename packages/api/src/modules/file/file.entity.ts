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
} from "@mikro-orm/core";
import mimeType from "mime-types";
import { config } from "../../config";
import { THUMBNAIL_SUPPORTED_TYPES } from "../../constants";
import { generateDeleteKey } from "../../helpers/generate-delete-key.helper";
import { Thumbnail } from "../thumbnail/thumbnail.entity";
import { User } from "../user/user.entity";
import { FileMetadata } from "./file-metadata.embeddable";

@Entity({ tableName: "files" })
export class File {
  @PrimaryKey()
  id: string;

  @Property({ nullable: true })
  host?: string;

  @Property()
  type: string;

  @Property()
  size: number;

  @Property()
  hash: string;

  @Embedded(() => FileMetadata, { nullable: true })
  metadata?: FileMetadata;

  @Property({ type: String, lazy: true, nullable: true, hidden: true })
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
    return mimeType.extension(this.type) || "bin";
  }

  @Property({ persist: false })
  get displayName() {
    const extension = this.extension;
    return this.name ? this.name : extension ? `${this.id}.${extension}` : this.id;
  }

  @Property({ persist: false })
  get urls() {
    const owner = this.owner.unwrap();
    const host = this.host ? config.hosts.find((host) => host.normalised === this.host) : null;
    const baseUrl = host ? host.url.replace("{{username}}", owner.username) : config.rootHost.url;
    return {
      view: baseUrl + this.paths.view,
      direct: baseUrl + this.paths.direct,
      metadata: baseUrl + this.paths.metadata,
      thumbnail: this.paths.thumbnail ? baseUrl + this.paths.thumbnail : null,
      delete: this.paths.delete ? baseUrl + this.paths.delete : null,
    };
  }

  @Property({ persist: false })
  get paths() {
    const extension = mimeType.extension(this.type);
    const viewUrl = `/f/${this.id}`;
    const directUrl = `/f/${this.id}.${extension}`;
    const metadataUrl = `/api/file/${this.id}`;
    const thumbnailUrl = THUMBNAIL_SUPPORTED_TYPES.has(this.type) ? `/t/${this.id}` : null;
    // todo: this.deleteKey is lazy which means the only time it should be present
    // is when the file is created or its explicitly asked for. that said, we should
    // still make sure we aren't leaking delete keys by accident.
    const deleteUrl = this.deleteKey ? `/f/${this.id}/delete?key=${this.deleteKey}` : null;
    return {
      view: viewUrl,
      direct: directUrl,
      metadata: metadataUrl,
      thumbnail: thumbnailUrl,
      delete: deleteUrl,
    };
  }

  [OptionalProps]:
    | "paths"
    | "urls"
    | "displayName"
    | "createdAt"
    | "thumbnail"
    | "name"
    | "deleteKey"
    | "host"
    | "extension";
}
