import { Expose } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";
import { File } from "./File";

@Entity()
export class Thumbnail {
  @PrimaryColumn()
  id!: string;

  @Column()
  size!: number;

  @Column()
  duration!: number;

  @OneToOne(() => File, { onDelete: "CASCADE", nullable: false })
  file!: File;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Expose()
  get storageKey() {
    if (!this.id) throw new Error("Missing thumbnail ID");
    return `thumbnails/${this.id}`;
  }
}
