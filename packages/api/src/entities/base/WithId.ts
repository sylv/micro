import { generateId } from "../../helpers/generateId";
import { BeforeInsert, PrimaryColumn } from "typeorm";

export abstract class WithId {
  @PrimaryColumn()
  id!: string;

  @BeforeInsert()
  protected addId() {
    if (!this.id) this.id = generateId(6);
  }
}
