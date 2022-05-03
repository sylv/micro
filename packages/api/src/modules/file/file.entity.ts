import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Expose } from "class-transformer";
import mimeType from "mime-types";
import { generateDeleteKey } from "../../helpers/generate-delete-key.helper";
import { TimestampType } from "../../timestamp.type";
import { THUMBNAIL_SUPPORTED_TYPES } from "../../constants";
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

  @Property({ type: String, lazy: true })
  deleteKey?: string = generateDeleteKey();

  @Property({ nullable: true })
  name?: string;

  @OneToOne({ entity: () => Thumbnail, inversedBy: "file", nullable: true, orphanRemoval: true })
  thumbnail?: Thumbnail;

  @ManyToOne(() => User)
  owner!: User;

  @Property({ type: TimestampType })
  createdAt = new Date();

  @Property({ persist: false })
  @Expose()
  get displayName() {
    const extension = mimeType.extension(this.type);
    return this.name ? this.name : extension ? `${this.id}.${extension}` : this.id;
  }

  @Property({ persist: false })
  @Expose()
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
}
