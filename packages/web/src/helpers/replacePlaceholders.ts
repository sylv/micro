export interface Placeholders {
  username: string;
}

const PLACEHOLDER_REGEX = /\{\{(?<name>[a-z]+)\}\}/gi;
export function replacePlaceholders(input: string, placeholders: Placeholders) {
  return input.replace(PLACEHOLDER_REGEX, (match, name) => {
    const value = name in placeholders && placeholders[name];
    if (!value) return match;
    return value;
  });
}
