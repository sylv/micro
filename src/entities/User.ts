import { Exclude } from "class-transformer";
import { nanoid } from "nanoid";
import { BeforeInsert, Column, Entity, Index, OneToOne } from "typeorm";
import { Permission } from "../constants";
import { WithId } from "./base/WithId";

@Entity("users")
export class User extends WithId {
  @Column({ unique: true })
  @Index()
  username!: string;

  @Column({ default: 0 })
  permissions!: number;

  @Column({ select: false })
  @Exclude()
  password!: string;

  @Column()
  @Exclude()
  token!: string;

  @Column()
  invite!: string;

  @OneToOne((type) => User, { nullable: true, onDelete: "CASCADE" })
  inviter?: User;

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.token) this.token = nanoid(64);
  }

  public checkPermissions(permission: Permission | number) {
    return (this.permissions & permission) === permission;
  }

  public addPermissions(permission: Permission | number) {
    this.permissions |= permission;
  }

  public clearPermissions(permission: Permission | number) {
    this.permissions &= ~permission;
  }
}
