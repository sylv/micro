import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, RelationId } from "typeorm";
import { File } from "./File";

@Entity()
export class Thumbnail {
  @PrimaryColumn()
  id!: string;

  @Column()
  size!: number;

  @Column()
  duration!: number;

  @OneToOne(() => File, (file) => file.thumbnail, { onDelete: "CASCADE", nullable: false })
  @JoinColumn()
  file!: File;

  @RelationId("file")
  fileId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Expose()
  get storageKey() {
    return `thumbnails/${this.id}.jpg`;
  }
}
