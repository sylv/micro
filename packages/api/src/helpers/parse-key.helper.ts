import { contentIdLength } from "./generate-content-id.helper";

const KEY_REGEX = new RegExp(`^(?<id>.{${contentIdLength}})(?<ext>\\.[A-z0-9]{2,})?$`);
export function parseKey(input: string) {
  const match = KEY_REGEX.exec(input);
  return {
    id: match?.groups?.id ?? input,
    ext: match?.groups?.ext?.slice(1) ?? undefined,
  };
}
