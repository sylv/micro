import { Exclude, Expose } from "class-transformer";
import { Column, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";
import { config } from "../config";
import { Content } from "./Content";
import { File } from "./File";

@Entity()
export class Thumbnail extends Content {
  @Column()
  size!: number;

  @Column()
  duration!: number;

  @Column("bytea")
  @Exclude()
  data!: Buffer;

  @OneToOne(() => File, (file) => file.thumbnail, { onDelete: "CASCADE", nullable: false })
  @JoinColumn()
  file!: File;

  @RelationId("file")
  fileId!: string;

  @Expose()
  get url() {
    return {
      download: `${config.host}/i/${this.fileId}`,
      thumbnail: `${config.host}/t/${this.fileId}`,
    };
  }
}
