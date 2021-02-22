import { Expose } from "class-transformer";
import human from "parse-duration";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { URLData, Permission } from "../types";

@Entity()
export class Invite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  inviter!: User;

  @OneToOne(() => User, (user) => user.invite, { nullable: true })
  @JoinColumn()
  invited!: User;

  @Column("bigint")
  expiresAt!: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @Expose()
  get url(): URLData {
    const view = `/invite/${this.id}`;
    const metadata = `/api/invite/${this.id}`;
    return { view, metadata };
  }

  @Expose()
  get invalid() {
    if (this.inviter && !this.inviter.checkPermissions(Permission.CREATE_INVITE)) {
      return true;
    }

    return Date.now() >= this.expiresAt;
  }

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.expiresAt) this.expiresAt = Date.now() + human("1h")!;
  }
}
