import { randomBytes } from 'crypto';

export function generateDeleteKey() {
  return randomBytes(16).toString('hex');
}
