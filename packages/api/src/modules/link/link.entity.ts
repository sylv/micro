import { Entity, IdentifiedReference, ManyToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { generateContentId } from "../../helpers/generate-content-id.helper";
import { User } from "../user/user.entity";

@Entity({ tableName: "links" })
export class Link {
  @PrimaryKey({ type: String })
  id = generateContentId();

  @Property({ length: 1024 })
  destination!: string;

  @Property({ nullable: true })
  host?: string;

  @Property()
  clicks: number = 0;

  @Property({ type: Date })
  createdAt = new Date();

  @ManyToOne(() => User, {
    hidden: true,
    wrappedReference: true,
  })
  owner!: IdentifiedReference<User>;

  [OptionalProps]: "host" | "clicks" | "createdAt";
}
