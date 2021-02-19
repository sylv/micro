import { Exclude, Expose } from "class-transformer";
import { Column, Entity, OneToOne, RelationId } from "typeorm";
import { config } from "../config";
import { Content } from "./base/Content";
import { Thumbnail } from "./Thumbnail";
import mimeType from "mime-types";
import { formatUrl } from "../helpers/formatUrl";

export interface FileMetadata {
  height?: number;
  width?: number;
  hasAlpha?: boolean;
  isProgressive?: boolean;
  // todo: duration for videos
  // todo: average colour?
}

@Entity()
export class File extends Content {
  @Column()
  type!: string;

  @Column()
  size!: number;

  @Column("text", { nullable: true })
  name?: string;

  @Column("bytea", { select: false })
  @Exclude()
  data!: Buffer;

  @Column({ default: 0 })
  views!: number;

  @Column("jsonb", { nullable: true })
  metadata?: FileMetadata;

  @OneToOne(() => Thumbnail, (thumbnail) => thumbnail.file, { onDelete: "SET NULL", nullable: true, cascade: true })
  thumbnail?: Thumbnail;

  @RelationId("thumbnail")
  thumbnailId?: string;

  @Expose()
  get extension() {
    return mimeType.extension(this.type) || null;
  }

  @Expose()
  get category() {
    return this.type.split("/").shift();
  }

  @Expose()
  get embeddable() {
    return this.category === "image" || this.category === "video" || this.category === "audio";
  }

  @Expose()
  get displayName() {
    const ext = this.extension;
    return this.name ? this.name : ext ? `${this.id}.${this.extension}` : this.id;
  }

  @Expose({ name: "url" })
  getUrls(host = config.host) {
    const extension = this.extension;
    const view = formatUrl(host, `/f/${this.id}`);
    const direct = formatUrl(host, `/f/${this.id}.${extension}`);
    const metadata = formatUrl(config.host, `/api/file/${this.id}`);
    const thumbnail = this.thumbnailId ? formatUrl(host, `/t/${this.id}`) : null;
    return { view, direct, thumbnail, metadata };
  }
}

export interface APIFile extends Omit<File, "getUrls"> {
  url: ReturnType<File["getUrls"]>;
}
