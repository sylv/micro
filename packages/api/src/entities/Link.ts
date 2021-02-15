import { Expose } from "class-transformer";
import { Entity, Column } from "typeorm";
import { config } from "../config";
import { Content } from "./Content";

@Entity()
export class Link extends Content {
  @Column()
  destination!: string;

  @Column({ default: 0 })
  clicks!: number;

  @Expose()
  get url() {
    return `${config.host}/s/${this.id}`;
  }
}
