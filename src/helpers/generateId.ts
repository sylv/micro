import crypto from "crypto";

export function generateId(length: number) {
  return crypto.randomBytes(length / 2).toString("hex");
}
