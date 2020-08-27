import bytes from "bytes";
import path from "path";
import inputConfig from "../config.json";
import fs from "fs";

//! config.json should NOT match this definition.
export interface MicroConfig {
  host: string;
  redirect?: string;
  maxUploadSize: number;
  maxErrorLogSize: number;
  maxCombinedLogSize: number;
  users: Map<string, string>;
  keys: Map<string, string>;
  thumbnails: number;
  uploadPath: {
    base: string;
    temp: string;
    thumbs: string;
  };
}

export const config: MicroConfig = {
  ...inputConfig,
  redirect: inputConfig.redirect,
  maxUploadSize: bytes(inputConfig.maxUploadSize),
  maxErrorLogSize: bytes(inputConfig.maxErrorLogSize),
  maxCombinedLogSize: bytes(inputConfig.maxCombinedLogSize),
  users: new Map(Object.entries(inputConfig.users)),
  keys: new Map(Object.entries(inputConfig.users).map((e) => e.reverse() as [string, string])), // prettier-ignore
  uploadPath: {
    base: path.resolve(process.cwd(), inputConfig.uploadPath),
    temp: path.resolve(process.cwd(), inputConfig.uploadPath, "temp"),
    thumbs: path.resolve(process.cwd(), inputConfig.uploadPath, "thumbs"),
  },
};

// kinda shitty but just ensures these directories exist at startup
fs.mkdirSync(config.uploadPath.temp, { recursive: true });
fs.mkdirSync(config.uploadPath.thumbs, { recursive: true });
