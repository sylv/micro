import rc from "rc";
import xbytes from "xbytes";

export interface MicroConfig {
  host: string;
  url: string;
  ssl: boolean;
  database: string;
  secret: string;
  inquiries: string;
  hosts: string[];
  uploadLimit: number;
  allowTypes?: string[];
  storagePath: string;
}

export const config = rc("micro", {
  uploadLimit: "50MB",
  ssl: true,
}) as MicroConfig;

config.uploadLimit = xbytes.parseSize(config.uploadLimit as any);
config.host = config.hosts[0];
