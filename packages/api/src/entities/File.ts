import { Logger } from "@nestjs/common";
import { Exclude, Expose } from "class-transformer";
import crypto from "crypto";
import mimeType from "mime-types";
import {
  BeforeInsert,
  BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm";
import { config } from "../config";
import { s3 } from "../driver";
import { THUMBNAIL_SUPPORTED_TYPES } from "../services/ThumbnailService";
import { User } from "./User";

export enum FileCategory {
  IMAGE,
  VIDEO,
  THUMBNAIL,
  AUDIO,
  OTHER,
}

@Entity("files")
export class File {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ enum: FileCategory })
  category!: FileCategory;

  @Column({ unique: true })
  key!: string;

  @Column()
  @Exclude()
  deletion_key!: string;

  @Column()
  @Index()
  mime_type!: string;

  @Column()
  size_bytes!: number;

  @Column({ type: "text", nullable: true })
  original_name!: string | null;

  @OneToOne(() => File, (file) => file.parent, { nullable: true, cascade: ["insert", "update"] })
  @JoinColumn()
  thumbnail!: File | null;

  @RelationId("thumbnail")
  thumbnail_id!: string;

  // todo: thumbnails are not removed when their parents are deleted
  @OneToOne(() => File, (file) => file.thumbnail, { nullable: true, cascade: true, onDelete: "CASCADE" })
  parent!: File | null;

  @RelationId("parent")
  parent_id!: string;

  @ManyToOne(() => User, (user) => user.files, { nullable: false })
  owner!: User;

  @RelationId("owner")
  owner_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @Expose()
  get supports_thumbnails() {
    if (!this.mime_type) throw new TypeError('No "mime_type" on file');
    return THUMBNAIL_SUPPORTED_TYPES.includes(this.mime_type);
  }

  @Expose()
  get extension_key() {
    const extension = mimeType.extension(this.mime_type);
    return `${this.key}.${extension}`;
  }

  get storage_key() {
    const extension = mimeType.extension(this.mime_type);
    return `${this.id}.${extension}`;
  }

  public getUrls(host?: string) {
    // todo: should probably validate the host is in config.domains
    const protocol = config.host.split("://").shift();
    const baseUrl = !host ? config.host : `${protocol}://${host}`;
    return {
      download_url: `${baseUrl}/i/${this.extension_key}`,
      thumbnail_url: this.supports_thumbnails ? `${baseUrl}/t/${this.extension_key}` : undefined,
      deletion_url: `${baseUrl}/d/${this.deletion_key}`,
    };
  }

  @BeforeInsert()
  protected beforeInsert() {
    this.key = crypto.randomBytes(3).toString("hex");
    this.deletion_key = crypto.randomBytes(20).toString("hex");

    if (this.category == undefined) {
      if (this.supports_thumbnails) this.category = FileCategory.IMAGE;
      else if (this.mime_type.startsWith("video")) this.category = FileCategory.VIDEO;
      else if (this.mime_type.startsWith("audio")) this.category = FileCategory.AUDIO;
      else this.category = FileCategory.OTHER;
    }
  }

  @BeforeRemove()
  protected async beforeRemove() {
    const log = new Logger("File:beforeRemove");
    await s3
      .deleteObject({ Bucket: config.s3.bucket, Key: this.storage_key })
      .promise()
      .then(() => {
        log.debug(`Removed ${this.storage_key} from S3`);
      })
      .catch((e) => {
        log.error(e);
        log.error(`Failed removing ${this.storage_key} from S3`);
      });
  }
}
