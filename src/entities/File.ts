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
import { logger } from "../logger";

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
    await fs.promises.unlink(filePath);
    logger.debug(`Unlinked ${this.id}`, { fileId: this.id, filePath: filePath });
  }

  static getFilePath(file: File) {
    // using a randomly generated path to avoid any issues with potentially risky user provided file names
    // extension is for convenience, we could go without it and save some hassle but then you can't easily
    // view the files on disk.
    if (!file.id) {
      throw new TypeError("FileMetadata.path called before file.id was populated");
    }

    return path.join(config.uploadPath.base, file.id + "." + file.extension);
  }
}
