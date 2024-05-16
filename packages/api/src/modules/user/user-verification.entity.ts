import { Entity, ManyToOne, PrimaryKey, Property, type Ref } from "@mikro-orm/core";
import { randomBytes } from "crypto";
import { UserEntity } from "./user.entity.js";

@Entity({ tableName: "users_verification" })
export class UserVerificationEntity {
  @PrimaryKey()
  id: string = randomBytes(16).toString("hex");

  @ManyToOne(() => UserEntity, { ref: true, deleteRule: "CASCADE" })
  user: Ref<UserEntity>;

  @Property()
  expiresAt: Date;
}
