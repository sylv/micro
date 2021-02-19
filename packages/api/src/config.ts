import { url } from "inspector";
import rc from "rc";

export interface MicroConfig {
  /** path to the config path, if any */
  host: string;
  url: string;
  ssl: boolean;
  secret: string;
  inquiries: string;
  hosts: string[];
  uploadLimit: number;
  allowTypes?: string[];
  database: {
    uri: string;
    synchronize: boolean;
  };
}

export const config = rc("micro", {
  uploadLimit: 50000000,
  ssl: true,
}) as MicroConfig;

config.host = config.hosts[0];
