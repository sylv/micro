import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { generateToken } from "../helpers/generateToken";
import { File } from "./File";

export enum UserRole {
  USER,
  ADMINISTRATOR,
}

export enum UserFlag {
  REQUIRE_PASSWORD_CHANGE = 1,
  BANNED = 1 << 1,
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  @Index()
  username!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  token!: string;

  @Column({ default: 0 })
  flags!: number;

  @Column({ type: "int", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => File, (file) => file.owner)
  @JoinColumn()
  files!: File[];

  @BeforeInsert()
  public addToken() {
    this.token = generateToken(64);
  }
}
