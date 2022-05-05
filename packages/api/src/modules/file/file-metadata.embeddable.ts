import { Embeddable, Property } from "@mikro-orm/core";

@Embeddable()
export class FileMetadata {
  @Property({ nullable: true, type: "number" })
  height?: number;

  @Property({ nullable: true, type: "number" })
  width?: number;
}
