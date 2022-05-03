import { Entity, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";
import { Expose } from "class-transformer";
import { generateDeleteKey } from "../../helpers/generate-delete-key.helper";
import { TimestampType } from "../../timestamp.type";
import { User } from "../user/user.entity";

@Entity()
export class Invite {
  @PrimaryKey({ type: String })
  id = generateDeleteKey();

  @Property({ nullable: true })
  permissions?: number;

  @ManyToOne({ entity: () => User, nullable: true })
  inviter?: User;

  @OneToOne({ entity: () => User, nullable: true })
  invited?: User;

  @Property({ type: TimestampType })
  createdAt = new Date();

  @Property({ type: TimestampType, nullable: true })
  expiresAt?: Date;

  @Property({ persist: false })
  @Expose()
  get expired() {
    return this.expiresAt && this.expiresAt.getTime() < Date.now();
  }

  @Property({ persist: false })
  @Expose()
  get url() {
    return `/invite/${this.id}`;
  }

  [OptionalProps]: "expiresAt" | "createdAt" | "invited" | "inviter" | "permissions" | "expired" | "url";
}
