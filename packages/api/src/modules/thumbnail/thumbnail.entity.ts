import { BlobType, Entity, OneToOne, OptionalProps, PrimaryKeyType, Property } from "@mikro-orm/core";
import { File } from "../file/file.entity";

@Entity({ tableName: "thumbnails" })
export class Thumbnail {
  @Property()
  size!: number;

  @Property()
  duration!: number;

  @Property()
  type!: string;

  @Property()
  width!: number;

  @Property()
  height!: number;

  @Property({ type: BlobType, lazy: true, hidden: true })
  data!: Buffer;

  @OneToOne({ entity: () => File, primary: true, onDelete: "CASCADE" })
  file!: File;

  @Property({ type: Date })
  createdAt = new Date();

  [PrimaryKeyType]: string;
  [OptionalProps]: "createdAt";
}
