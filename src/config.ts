import rc from "rc";
import path from "path";

export interface MicroConfig {
  /** path to the config path, if any */
  host: string;
  config: string;
  upload_limit: number;
  jwt_secret: string;
  domains: string[];
  cache_path: string;
  allow_types: string[];
  s3: {
    endpoint: string;
    bucket: string;
    access_key: string;
    secret_key: string;
  };
  database: {
    uri: string;
    synchronize: boolean;
  };
}

export const config = rc("micro", {
  upload_limit: 50000000,
  allow_types: [
    "text/plain",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "audio/webm",
    "video/webm",
    "video/mp4",
  ],
}) as MicroConfig;

export const basePath = config.config ? path.dirname(config.config) : process.cwd();
export const cachePath = path.resolve(basePath, config.cache_path);
