import bytes from "bytes";
import path from "path";
import fs from "fs";
import rc from "rc";

const inputConfig = rc("micro", {
  host: "https://i.example.com",
  // relative to process.cwd(), can be an absolute path
  uploadPath: "./store",
  redirect: "https://example.com",
  // set to 0 or -1 to disable
  thumbnailSize: 200,
  // name:key
  users: {},
  sizeLimits: {
    upload: "50MB",
    errorLog: "5MB",
    combinedLog: "5MB",
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
  readonly host: string = inputConfig.host;
  readonly thumbnailSize?: number = inputConfig.thumbnailSize;
  readonly redirect?: string = inputConfig.redirect;
  readonly synchronize?: boolean = inputConfig.synchronize;
  readonly keys: Map<string,string> = new Map(Object.entries(inputConfig.users).map((e) => e.reverse() as [string, string])) // prettier-ignore
  readonly sizeLimits: MicroConfigSizeLimits = {
    upload: bytes(inputConfig.sizeLimits.upload as string),
    errorLog: bytes(inputConfig.sizeLimits.errorLog as string),
    combinedLog: bytes(inputConfig.sizeLimits.combinedLog as string),
  };

  readonly paths: MicroConfigPaths = {
    base: path.resolve(process.cwd(), inputConfig.uploadPath),
    temp: path.resolve(process.cwd(), inputConfig.uploadPath, "temp"),
    thumbs: path.resolve(process.cwd(), inputConfig.uploadPath, "thumbs"),
  };

  constructor() {
    // kinda shitty but just ensures these directories exist at startup
    fs.mkdirSync(this.paths.temp, { recursive: true });
    fs.mkdirSync(this.paths.thumbs, { recursive: true });
  }
}

export const config = new MicroConfig();
