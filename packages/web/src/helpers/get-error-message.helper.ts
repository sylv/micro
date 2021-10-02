import { isObject } from "@micro/common";

export function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") return error;
  if (isObject(error) && "message" in error && typeof error.message === "string") {
    return error.message;
  }
}
