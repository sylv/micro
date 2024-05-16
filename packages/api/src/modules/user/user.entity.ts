import { ArrayType, Collection, Entity, Index, OneToMany, OneToOne, OptionalProps, PrimaryKey, Property, type Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import { generateContentId } from "../../helpers/generate-content-id.helper.js";
import { FileEntity } from "../file/file.entity.js";
import { InviteEntity } from "../invite/invite.entity.js";
import { UserVerificationEntity } from "./user-verification.entity.js";

@Entity({ tableName: "users" })
@ObjectType("User")
export class UserEntity {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateContentId();

  @Property({ unique: true, index: true, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Property({ default: false })
  @Field()
  verifiedEmail: boolean;

  @Property({ unique: true, index: true })
  @Field()
  @Index()
  username: string;

  @Property()
  @Field()
  permissions: number = 0;

  @Property({ hidden: true })
  @Exclude()
  password: string;

  @Property({ hidden: true })
  @Index()
  secret: string;

  @OneToOne({ entity: () => InviteEntity, nullable: true, ref: true })
  invite?: Ref<InviteEntity>;

  @Property()
  @Field(() => [String])
  tags: string[] = [];

  @OneToMany(
    () => FileEntity,
    (file) => file.owner,
    { orphanRemoval: true, hidden: true },
  )
  @Exclude()
  files = new Collection<FileEntity>(this);

  @Exclude()
  @OneToMany(
    () => UserVerificationEntity,
    (verification) => verification.user,
    {
      orphanRemoval: true,
      persist: true,
      hidden: true,
    },
  )
  verifications = new Collection<UserVerificationEntity>(this);

  @Exclude()
  @Property({ nullable: true, hidden: true })
  otpSecret?: string;

  @Field()
  @Property({ default: false, hidden: true })
  otpEnabled: boolean;

  @Exclude()
  @Property({ nullable: true, hidden: true, type: ArrayType })
  otpRecoveryCodes?: string[];

  @Exclude()
  @Property({ hidden: true, nullable: true })
  disabledReason?: string;

  [OptionalProps]: "permissions" | "tags" | "verifiedEmail";
}
