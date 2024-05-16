export function hashToObject(hash: string) {
  const result: Record<string, string> = {};
  const pairs = hash.slice(1).split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    result[key] = value;
  }

  return result;
}
