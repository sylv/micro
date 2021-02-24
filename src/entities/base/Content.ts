import { Exclude } from "class-transformer";
import { CreateDateColumn, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { WithId } from "./WithId";
import { User } from "../User";

export enum ContentType {
  FILE,
  LINK,
}

export abstract class Content extends WithId {
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn()
  @Exclude()
  owner!: User;

  @RelationId("owner")
  ownerId!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
