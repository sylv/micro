import { Expose } from "class-transformer";
import { Entity, Column } from "typeorm";
import { config } from "../config";
import { Content } from "./Content";

@Entity()
export class Link extends Content {
  @Column()
  destination!: string;

  @Expose()
  get url() {
    return `${config.url}/s/${this.id}`;
  }
}
