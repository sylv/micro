import { Exclude, Expose } from "class-transformer";
import mimeType from "mime-types";
import { Column, Entity } from "typeorm";
import { ThumbnailService } from "../services/ThumbnailService";
import { URLData } from "../types";
import { Content } from "./base/Content";

@Entity()
export class File extends Content {
  @Column()
  type!: string;

  @Column()
  size!: number;

  @Column("text", { nullable: true })
  name?: string;

  @Expose()
  get thumbnail() {
    return ThumbnailService.checkSupport(this.type);
  }

  @Expose()
  get extension() {
    return mimeType.extension(this.type) || null;
  }

  @Expose()
  get embeddable() {
    // discord doesnt like embedding videos,
    // return this.type.startsWith('image') || this.type.startsWith('audio') || this.type.startsWith('video')
    return this.type.startsWith("image") || this.type.startsWith("audio");
  }

  @Expose()
  get displayName() {
    const ext = this.extension;
    return this.name ? this.name : ext ? `${this.id}.${ext}` : this.id;
  }

  @Exclude()
  get storageKey() {
    if (!this.id) throw new Error("Missing file ID");
    return `files/${this.id}`;
  }

  @Expose()
  get urls(): URLData {
    const extension = this.extension;
    const view = `/f/${this.id}`;
    const direct = `/f/${this.id}.${extension}`;
    const metadata = `/api/file/${this.id}`;
    const thumbnail = this.thumbnail ? `/t/${this.id}` : null;
    return { view, direct, metadata, thumbnail };
  }
}
