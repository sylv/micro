import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import fs from "fs";
import { nanoid } from "nanoid";
import os from "os";
import path from "path";
import stream from "stream";
import getSizeTransform from "stream-size";
import { promisify } from "util";
import { ExifTransformer } from "../../classes/ExifTransformer";
import { config } from "../../config";

const pipeline = promisify(stream.pipeline);

@Injectable()
export class StorageService {
  private readonly createdPaths = new Set();
  private readonly path: string;
  constructor() {
    this.path = path.join(process.cwd(), config.storagePath);
  }

  public async create(stream: NodeJS.ReadableStream) {
    const uploadId = nanoid();
    const uploadPath = path.join(os.tmpdir(), `.micro${uploadId}`);

    try {
      const hashStream = crypto.createHash("sha256");
      const exifTransform = new ExifTransformer();
      const sizeTransform = getSizeTransform(config.uploadLimit);
      const writeStream = fs.createWriteStream(uploadPath);
      await Promise.all([
        // prettier-ignore
        pipeline(stream, hashStream),
        pipeline(stream, exifTransform, sizeTransform, writeStream),
      ]);

      const digest = hashStream.digest("hex");
      const filePath = this.getPathFromHash(digest);
      const fileDirectory = path.dirname(filePath);
      if (!this.createdPaths.has(fileDirectory)) {
        await fs.promises.mkdir(fileDirectory, { recursive: true });
        this.createdPaths.add(fileDirectory);
      }

      await fs.promises.rename(uploadPath, filePath);
      return {
        hash: digest,
        size: sizeTransform.sizeInBytes,
      };
    } catch (err) {
      await fs.promises.unlink(uploadPath).catch(() => false);
      throw err;
    }
  }

  public async delete(hash: string) {
    try {
      const filePath = this.getPathFromHash(hash);
      await fs.promises.unlink(filePath);
    } catch (err) {
      switch (err.code) {
        case "ENOENT":
          return;
        default:
          throw err;
      }
    }
  }

  public createReadStream(hash: string, range?: { start?: number | null; end?: number | null } | null) {
    const filePath = this.getPathFromHash(hash);
    return fs.createReadStream(filePath, {
      start: range?.start ?? undefined,
      end: range?.end ?? undefined,
    });
  }

  private getPathFromHash(hash: string) {
    return path.join(this.path, hash[0], hash[1], hash);
  }
}
