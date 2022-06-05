import { Collection, Entity, OneToMany, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { File } from "../file/file.entity";
import { generateContentId } from "../../helpers/generate-content-id.helper";
import { Invite } from "../invite/invite.entity";
import { Exclude } from "class-transformer";

@Entity({ tableName: "users" })
export class User {
  @PrimaryKey({ type: String })
  id = generateContentId();

  @Property({ unique: true, index: true })
  username!: string;

  @Property({ type: Number })
  permissions = 0;

  @Property()
  @Exclude()
  password!: string;

  @Property()
  secret!: string;

  @OneToOne({ nullable: true })
  invite?: Invite;

  @Property()
  tags: string[] = [];

  @OneToMany(() => File, (file) => file.owner, { orphanRemoval: true })
  @Exclude()
  files = new Collection<File>(this);

  [OptionalProps]: "permissions" | "tags";
}
