import { Exclude, Expose } from "class-transformer";
import mimeType from "mime-types";
import { config } from "../config";
import { s3 } from "../s3";
import { BeforeRemove, Column, Entity } from "typeorm";
import { ThumbnailService } from "../services/ThumbnailService";
import { Content } from "./base/Content";
import { Logger } from "@nestjs/common";

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
  get urls() {
    const extension = this.extension;
    const view = `/f/${this.id}`;
    const direct = `/f/${this.id}.${extension}`;
    const metadata = `/api/file/${this.id}`;
    const thumbnail = this.thumbnail ? `/t/${this.id}` : null;
    return { view, direct, metadata, thumbnail };
  }

  @BeforeRemove()
  async beforeRemove() {
    const logger = new Logger(File.name);
    logger.debug(`Removing "${this.id}" from S3`);
    await s3.deleteObject({ Bucket: config.storage.bucket, Key: this.storageKey }).promise();
  }
}
