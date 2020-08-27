import { Exclude } from "class-transformer";
import fs from "fs";
import path from "path";
import {
  BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";
import { config } from "../config";

const THUMBNAIL_SUPPORTED_EXT = ["png", "jpg", "jpeg", "webp"];

@Entity("files")
export class File {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index()
  owner!: string;

  @Column({ unique: true })
  @Index()
  /** The user-provided file name. */
  name!: string;

  @Column()
  mime_type!: string;

  @Column()
  extension!: string;

  @Column("bigint")
  size_bytes!: number;

  @Column({ unique: true })
  @Generated("uuid")
  @Index()
  @Exclude()
  deletion_key!: string;

  @CreateDateColumn()
  uploaded_at!: Date;

  @BeforeRemove()
  protected async beforeRemove() {
    const filePath = File.getFilePath(this);
    const thumbPath = File.getThumbPath(this);
    await fs.promises.unlink(filePath);
    if (thumbPath) {
      // delete any thumbs and ignore if it errors such as ENOENT
      await fs.promises.unlink(thumbPath).catch(() => false);
    }
  }

  static getFilePath(file: File) {
    // file.id will only exist if the file has been saved, otherwise sqlite won't have generated the id.
    if (!file.id) throw new TypeError("FileMetadata.getFilePath called before file.id was populated"); // prettier-ignore
    return path.join(config.paths.base, file.id + "." + file.extension);
  }

  static getThumbPath(file: File): string | undefined {
    if (!file.id) throw new TypeError("FileMetadata.getThumbPath called before file.id was populated"); // prettier-ignore
    const supported = THUMBNAIL_SUPPORTED_EXT.includes(file.extension);
    if (!supported) return;
    return path.join(config.paths.thumbs, file.id + ".jpg");
  }
}
