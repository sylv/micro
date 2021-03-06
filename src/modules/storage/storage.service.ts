import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import fs from "fs";
import { nanoid } from "nanoid";
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

  public async create(stream: NodeJS.ReadableStream) {
    // using .tmp in the upload dir solves cross-device link issues
    const uploadId = nanoid(6);
    const uploadPath = path.join(config.storagePath, ".tmp", `.micro${uploadId}`);
    await this.ensureDirectoryExists(uploadPath);

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
      await this.ensureDirectoryExists(filePath);
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
    // todo: we should throw an error if the file doesn't exist, at the moment
    // the entire app will crash.
    const filePath = this.getPathFromHash(hash);
    return fs.createReadStream(filePath, {
      start: range?.start ?? undefined,
      end: range?.end ?? undefined,
    });
  }

  private getPathFromHash(hash: string) {
    return path.join(config.storagePath, hash[0], hash[1], hash);
  }

  private async ensureDirectoryExists(filePath: string) {
    const fileDirectory = path.dirname(filePath);
    if (!this.createdPaths.has(fileDirectory)) {
      await fs.promises.mkdir(fileDirectory, { recursive: true });
      this.createdPaths.add(fileDirectory);
    }
  }
}
