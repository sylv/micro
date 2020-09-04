import bytes from "bytes";
import fs from "fs";
import path from "path";
import rc from "rc";

const inputConfig = rc("micro", {
  HOST: "https://i.example.com",
  // relative to process.cwd(), can be an absolute path
  DATA_PATH: "./store",
  REDIRECT: "https://example.com",
  // set to 0 or -1 to disable
  THUMBNAILS: 200,
  // name:key
  USERS: {},
  SIZE_LIMITS: {
    UPLOAD: "50MB",
    ERROR_LOG: "5MB",
    COMBINED_LOG: "5MB",
  },
});

export interface MicroConfigSizeLimits {
  upload: number;
  errorLog: number;
  combinedLog: number;
}

export interface MicroConfigPaths {
  base: string;
  temp: string;
  thumbs: string;
}

export class MicroConfig {
  readonly host: string = inputConfig.HOST.endsWith('/') ? inputConfig.HOST.slice(0,-1) : inputConfig.HOST; // prettier-ignore
  readonly https: boolean = inputConfig.HTTPS ?? inputConfig.HOST.startsWith("https");
  readonly redirect?: string = inputConfig.REDIRECT;
  readonly thumbnailSize?: number = inputConfig.THUMBNAIL_SIZE;
  readonly synchronize?: boolean = inputConfig.SYNCHRONIZE;
  readonly keys: Map<string,string> = new Map(Object.entries(inputConfig.USERS).map((e) => e.reverse() as [string, string])) // prettier-ignore
  readonly sources?: string[] = inputConfig.configs;
  readonly sizeLimits: MicroConfigSizeLimits = {
    upload: bytes(inputConfig.SIZE_LIMITS.UPLOAD as string),
    errorLog: bytes(inputConfig.SIZE_LIMITS.ERROR_LOG as string),
    combinedLog: bytes(inputConfig.SIZE_LIMITS.COMBINED_LOG as string),
  };

  readonly paths: MicroConfigPaths = {
    base: path.resolve(process.cwd(), inputConfig.DATA_PATH),
    temp: path.resolve(process.cwd(), inputConfig.DATA_PATH, "temp"),
    thumbs: path.resolve(process.cwd(), inputConfig.DATA_PATH, "thumbs"),
  };

  constructor() {
    // kinda shitty but just ensures these directories exist at startup
    fs.mkdirSync(this.paths.temp, { recursive: true });
    fs.mkdirSync(this.paths.thumbs, { recursive: true });
  }
}

export const config = new MicroConfig();
