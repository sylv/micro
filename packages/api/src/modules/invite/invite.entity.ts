import { OptionalProps, type Ref } from "@mikro-orm/core";
import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { rootHost } from "../../config.js";
import { generateDeleteKey } from "../../helpers/generate-delete-key.helper.js";
import { UserEntity } from "../user/user.entity.js";

@Entity({ tableName: "invites" })
@ObjectType("Invite")
export class InviteEntity {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateDeleteKey();

  @Property({ nullable: true })
  @Field({ nullable: true })
  permissions?: number;

  @ManyToOne({ entity: () => UserEntity, ref: true, nullable: true })
  inviter?: Ref<UserEntity>;

  @OneToOne({ entity: () => UserEntity, ref: true, nullable: true })
  invited?: Ref<UserEntity>;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @Property()
  @Field()
  skipVerification: boolean = false;

  @Property({ nullable: true })
  @Field({ nullable: true })
  expiresAt?: Date;

  @Property({ persist: false, type: "boolean" })
  @Field(() => Boolean)
  get expired() {
    return this.expiresAt != null && this.expiresAt.getTime() <= Date.now();
  }

  @Property({ persist: false, type: "boolean" })
  @Field(() => Boolean)
  get consumed() {
    return !!this.invited;
  }

  @Property({ persist: false, type: "string" })
  @Field(() => String)
  get path() {
    return `/invite/${this.id}`;
  }

  @Property({ persist: false, type: "string" })
  @Field(() => String)
  get url() {
    const url = new URL(rootHost.url);
    url.pathname = this.path;
    return url;
  }

  [OptionalProps]: "url" | "path" | "consumed" | "expired" | "createdAt" | "skipVerification";
}
