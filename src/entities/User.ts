import { Exclude } from "class-transformer";
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { File } from "./File";

export enum UserRole {
  USER,
  ADMINISTRATOR,
}

export enum UserFlag {
  REQUIRE_PASSWORD_CHANGE = 1,
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

  @Column({ default: 0 })
  flags!: number;

  @Column({ type: "int", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => File, (file) => file.owner)
  files!: File[];
}
