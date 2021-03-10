import { Logger } from "@nestjs/common";
import { Exclude, Expose } from "class-transformer";
import mimeType from "mime-types";
import { BeforeRemove, Column, Entity } from "typeorm";
import { config } from "../config";
import { EMBEDDABLE_IMAGE_TYPES } from "../constants";
import { s3 } from "../s3";
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
    return EMBEDDABLE_IMAGE_TYPES.includes(this.type);
  }

  @Expose()
  get extension() {
    return mimeType.extension(this.type) || null;
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
