import { Exclude } from "class-transformer";
import { CreateDateColumn, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { User } from "../User";
import { WithId } from "./WithId";

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

  @CreateDateColumn()
  createdAt!: Date;
}
