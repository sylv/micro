import { Entity, ManyToOne, PrimaryKey, Property, type Ref } from "@mikro-orm/core";
import { randomBytes } from "crypto";
import { User } from "./user.entity.js";

@Entity({ tableName: "users_verification" })
export class UserVerification {
  @PrimaryKey()
  id: string = randomBytes(16).toString("hex");

  @ManyToOne(() => User, { ref: true, deleteRule: "CASCADE" })
  user: Ref<User>;

  @Property()
  expiresAt: Date;
}
