import { customAlphabet } from 'nanoid';
import blocklist from '../blocklist.json';

const contentIdLength = 6;
const paranoidIdLength = 12;
const contentIdAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const contentIdGenerator = customAlphabet(contentIdAlphabet, contentIdLength);

export const generateParanoidId = customAlphabet(contentIdAlphabet, paranoidIdLength);

export function generateContentId(): string {
  const id = contentIdGenerator();
  if (blocklist.includes(id.toLowerCase())) {
    return generateContentId();
  }

  return id;
}
