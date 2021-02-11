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
    // this is purely for aesthetics, the actual url does not matter
    const category = this.type.split("/").shift();
    switch (category) {
      case "image":
        return {
          download: `${config.host}/i/${this.id}`,
          thumbnail: this.thumbnailId ? `${config.host}/t/${this.id}` : null,
        };
      default:
        return {
          download: `${config.host}/f/${this.id}`,
          thumbnail: this.thumbnailId ? `${config.host}/f/${this.id}` : null,
        };
    }
  }
}
