import rc from "rc";

export interface MicroConfig {
  /** path to the config path, if any */
  url: string;
  secret: string;
  domains: string[];
  uploadLimit: number;
  allowTypes: string[];
  database: {
    uri: string;
    synchronize: boolean;
  };
}

export const config = rc("micro", {
  uploadLimit: 50000000,
  allowTypes: [
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
