import { config } from "../config";

export function formatUrl(host: string, path: string) {
  const proto = config.ssl ? "https" : "http";
  return `${proto}://${host}${path}`;
}
