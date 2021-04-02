import { customAlphabet } from "nanoid";
import { BeforeInsert, PrimaryColumn } from "typeorm";

export const idAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const idLength = 6;
export const idGenerator = customAlphabet(idAlphabet, idLength);

export abstract class WithId {
  @PrimaryColumn()
  id!: string;

  @BeforeInsert()
  public addId() {
    if (!this.id) this.id = idGenerator();
  }
}
