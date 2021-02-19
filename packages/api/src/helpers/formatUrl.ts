import { config } from "../config";

export function formatUrl(host: string, path?: string | null) {
  if (!path) return;
  const proto = config.ssl ? "https" : "http";
  return `${proto}://${host}${path}`;
}
