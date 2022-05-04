import { Entity, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import mimeType from "mime-types";
import { config } from "../../config";
import { THUMBNAIL_SUPPORTED_TYPES } from "../../constants";
import { generateDeleteKey } from "../../helpers/generate-delete-key.helper";
import { TimestampType } from "../../timestamp.type";
import { Thumbnail } from "../thumbnail/thumbnail.entity";
import { User } from "../user/user.entity";

@Entity({ tableName: "files" })
export class File {
  @PrimaryKey()
  id!: string;

  @Property()
  type!: string;

  @Property()
  size!: number;

  @Property()
  hash!: string;

  @Property({ nullable: true })
  host?: string;

  @Property({ type: String, lazy: true, hidden: true })
  deleteKey?: string = generateDeleteKey();

  @Property({ nullable: true })
  name?: string;

  @OneToOne({ entity: () => Thumbnail, nullable: true })
  thumbnail?: Thumbnail;

  @ManyToOne(() => User)
  owner!: User;

  @Property({ type: TimestampType })
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
  get url() {
    if (!this.owner.username || !this.host) {
      return {
        view: config.rootHost.url + this.urls.view,
        direct: config.rootHost.url + this.urls.direct,
      };
    }

    const replacedHost = this.host.replace("{{username}}", this.owner.username);
    return {
      view: replacedHost + this.urls.view,
      direct: replacedHost + this.urls.direct,
    };
  }

  @Property({ persist: false })
  get urls() {
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
    | "urls"
    | "displayName"
    | "createdAt"
    | "thumbnail"
    | "name"
    | "deleteKey"
    | "host"
    | "extension"
    | "url";
}
