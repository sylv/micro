import { Exclude } from "class-transformer";
import { BeforeInsert, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { generateId } from "../helpers/generateId";
import { File } from "./File";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  @Index()
  username!: string;

  @Column({ select: false })
  @Exclude()
  password!: string;

  @Column({ select: false })
  @Exclude()
  token!: string;

  @OneToMany(() => File, (file) => file.owner)
  files!: File[];

  @BeforeInsert()
  public addToken() {
    this.token = generateId(64);
  }
}
