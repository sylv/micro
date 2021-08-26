import { customAlphabet } from "nanoid";
import blocklist from "../data/blocklist.json";

// note: changing this will require changes to the file.service.ts regex
export const contentIdLength = 6;
export const contentIdAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const contentIdGenerator = customAlphabet(contentIdAlphabet, contentIdLength);

export function generateContentId(): string {
  const id = contentIdGenerator();
  if (blocklist.includes(id.toLowerCase())) {
    return generateContentId();
  }

  return id;
}
