import { Expose } from "class-transformer";
import { Column, Entity } from "typeorm";
import { Content } from "./base/Content";
import { URLData } from "../types";

@Entity()
export class Link extends Content {
  @Column()
  destination!: string;

  @Column({ default: 0 })
  clicks!: number;

  @Expose({ name: "url" })
  get url(): URLData {
    const direct = `/s/${this.id}`;
    const metadata = `/api/link/${this.id}`;
    return { direct, metadata };
  }
}
