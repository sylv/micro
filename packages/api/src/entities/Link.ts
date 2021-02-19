import { Expose } from "class-transformer";
import { Entity, Column } from "typeorm";
import { config } from "../config";
import { Content } from "./base/Content";
import { formatUrl } from "../helpers/formatUrl";

@Entity()
export class Link extends Content {
  @Column()
  destination!: string;

  @Column({ default: 0 })
  clicks!: number;

  @Expose({ name: "url" })
  getUrl(host = config.host) {
    return formatUrl(host, `/s/${this.id}`);
  }
}

export interface APILink extends Omit<Link, "getUrl"> {
  url: string;
}
