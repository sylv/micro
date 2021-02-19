import { Expose } from "class-transformer";
import mimeType from "mime-types";
import { Column, Entity, OneToOne, RelationId } from "typeorm";
import { URLData } from "../types";
import { Content } from "./base/Content";
import { Thumbnail } from "./Thumbnail";

@Entity()
export class File extends Content {
  @Column()
  type!: string;

  @Column()
  size!: number;

  @Column("text", { nullable: true })
  name?: string;

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
    // discord doesnt like embedding videos
    // return this.category === "image" || this.category === "video" || this.category === "audio";
    return this.category === "image" || this.category === "audio";
  }

  @Expose()
  get displayName() {
    const ext = this.extension;
    return this.name ? this.name : ext ? `${this.id}.${ext}` : this.id;
  }

  @Expose()
  get storageKey() {
    return `files/${this.id}.${this.extension}`;
  }

  @Expose()
  get urls(): URLData {
    const extension = this.extension;
    const view = `/f/${this.id}`;
    const direct = `/f/${this.id}.${extension}`;
    const metadata = `/api/file/${this.id}`;
    const thumbnail = this.thumbnailId ? `/t/${this.id}` : null;
    return { view, direct, metadata, thumbnail };
  }
}
