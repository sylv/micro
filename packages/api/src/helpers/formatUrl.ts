import { config } from "../config";

export function formatUrl(host: string, path?: string | null) {
  const proto = config.ssl ? "https" : "http";
  return `${proto}://${host}${path}`;
}
