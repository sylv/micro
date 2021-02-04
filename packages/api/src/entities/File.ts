import { Exclude, Expose } from "class-transformer";
import { Column, Entity, OneToOne, RelationId } from "typeorm";
import { config } from "../config";
import { Content } from "./Content";
import { Thumbnail } from "./Thumbnail";

export interface FileMetadata {
  height?: number;
  width?: number;
  duration?: number;
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

  @Column("jsonb", { nullable: true })
  metadata?: FileMetadata;

  @OneToOne(() => Thumbnail, (thumbnail) => thumbnail.file, { onDelete: "SET NULL", nullable: true, cascade: true })
  thumbnail?: Thumbnail;

  @RelationId("thumbnail")
  thumbnailId?: string;

  @Expose()
  get url() {
    return {
      download: `${config.url}/i/${this.id}`,
      thumbnail: this.thumbnailId ? `${config.url}/t/${this.id}` : null,
    };
  }
}
