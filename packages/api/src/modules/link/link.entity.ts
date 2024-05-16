import { Entity, ManyToOne, OptionalProps, PrimaryKey, Property, type Ref } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Exclude } from "class-transformer";
import { generateContentId } from "../../helpers/generate-content-id.helper.js";
import { ResourceEntity } from "../../helpers/resource.entity-base.js";
import { UserEntity } from "../user/user.entity.js";

@Entity({ tableName: "links" })
@ObjectType("Link")
export class LinkEntity extends ResourceEntity {
  @PrimaryKey()
  @Field(() => ID)
  id: string = generateContentId();

  @Property({ length: 1024 })
  @Field()
  destination: string;

  @Property()
  @Field()
  clicks: number = 0;

  @Property()
  @Field()
  createdAt: Date = new Date();

  @ManyToOne(() => UserEntity, { ref: true, hidden: true })
  @Exclude()
  owner: Ref<UserEntity>;

  getPaths() {
    return {
      view: `/l/${this.id}`,
      direct: `/l/${this.id}`,
    };
  }

  [OptionalProps]: "createdAt" | "clicks";
}
