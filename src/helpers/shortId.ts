import { customAlphabet } from "nanoid";

export const shortIdAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const shortIdLength = 6;
export const shortId = customAlphabet(shortIdAlphabet, shortIdLength);
