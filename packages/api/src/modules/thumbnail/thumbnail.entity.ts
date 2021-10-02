import { BlobType, Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { TimestampType } from "../../timestamp.type";
import { File } from "../file/file.entity";

@Entity({ tableName: "thumbnails" })
export class Thumbnail {
  @PrimaryKey()
  id!: string;

  @Property()
  size!: number;

  @Property()
  duration!: number;

  @Property({ type: BlobType, lazy: true })
  data!: Buffer;

  @OneToOne({ entity: () => File, mappedBy: "thumbnail" })
  file!: File;

  @Property({ type: TimestampType })
  createdAt = new Date();
}
