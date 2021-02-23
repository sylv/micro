import { generateId } from "../../helpers/generateId";
import { BeforeInsert, PrimaryColumn } from "typeorm";

export abstract class WithId {
  @PrimaryColumn()
  id!: string;

  @BeforeInsert()
  public addId() {
    if (!this.id) this.id = generateId(6);
  }
}
