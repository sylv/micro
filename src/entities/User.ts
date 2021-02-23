import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, Index, OneToMany, OneToOne } from "typeorm";
import { generateId } from "../helpers/generateId";
import { Permission } from "../types";
import { WithId } from "./base/WithId";
import { File } from "./File";
import { Invite } from "./Invite";

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

  @OneToMany(() => File, (file) => file.owner)
  files!: File[];

  @OneToOne(() => Invite, { nullable: false, onDelete: "CASCADE" })
  invite!: Invite;

  @BeforeInsert()
  protected beforeInsert() {
    if (!this.token) this.token = generateId(64);
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
