import { Exclude } from "class-transformer";
import { BeforeInsert, CreateDateColumn, JoinColumn, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { generateId } from "../helpers/generateId";
import { User } from "./User";

export enum ContentType {
  FILE,
  LINK,
}

// todo: soft deletion where it removes content.data (for files)
export abstract class Content {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn()
  @Exclude()
  owner!: User;

  @RelationId("owner")
  ownerId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.id) this.id = generateId(6);
  }
}
