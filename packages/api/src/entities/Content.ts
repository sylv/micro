import { Exclude } from "class-transformer";
import { BeforeInsert, Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { generateId } from "../helpers/generateId";
import { User } from "./User";

export abstract class Content {
  @PrimaryColumn()
  id!: string;

  @Column()
  @Exclude()
  deletionId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: false })
  @JoinColumn()
  owner!: User;

  @RelationId("owner")
  ownerId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @BeforeInsert()
  protected beforeInsert() {
    // todo: we should check for duplicates here,
    // or typeorm will update existing items instead of
    // throwing a duplicate error.
    this.id = generateId(6);
    this.deletionId = generateId(32);
  }
}
