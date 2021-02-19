import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, RelationId } from "typeorm";
import { File } from "./File";

@Entity()
export class Thumbnail {
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

  @CreateDateColumn()
  createdAt!: Date;
}
