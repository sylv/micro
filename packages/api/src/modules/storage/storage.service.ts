import { Injectable, Logger } from '@nestjs/common';
import crypto from 'crypto';
import fs from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';
import { default as getSizeTransform } from 'stream-size';
import { ExifTransformer } from '../../classes/ExifTransformer.js';
import { config } from '../../config.js';

// @ts-expect-error @types/bun is missing this but bun supports it (probably)
// todo: in the future this should work™️
import { pipeline } from 'stream/promises';

@Injectable()
export class StorageService {
  private readonly createdPaths = new Set();
  private readonly logger = new Logger(StorageService.name);

  async create(stream: NodeJS.ReadableStream) {
    // using .tmp in the upload dir solves cross-device link issues
    // todo: using .tmp instead of the actual temp folder means if the process exits half way through an upload,
    // that file will be left behind. we could just use `fs-extra` and `/tmp` but that isn't great either since it means
    // we're copying the file which is slow, especially for large files.
    const uploadId = nanoid(6);
    const uploadPath = path.join(config.storagePath, '.tmp', `.micro${uploadId}`);
    await this.ensureDirectoryExists(uploadPath);

    try {
      const hashStream = crypto.createHash('sha256');
      const exifTransform = new ExifTransformer();
      const sizeTransform = getSizeTransform(config.uploadLimit);
      const writeStream = fs.createWriteStream(uploadPath);

      await Promise.all([
        // prettier-ignore
        pipeline(stream, hashStream),
        pipeline(stream, exifTransform, sizeTransform, writeStream),
      ]);

      const digest = hashStream.digest('hex');
      const filePath = this.getPathFromHash(digest);
      await this.ensureDirectoryExists(filePath);
      await fs.promises.rename(uploadPath, filePath);
      return {
        hash: digest,
        size: sizeTransform.sizeInBytes,
      };
    } catch (error: unknown) {
      await fs.promises.unlink(uploadPath).catch(() => false);
      throw error;
    }
  }

  async delete(hash: string) {
    try {
      this.logger.debug(`Deleting "${hash}" from disk`);
      const filePath = this.getPathFromHash(hash);
      await fs.promises.unlink(filePath);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return;
      }

      throw error;
    }
  }

  createReadStream(hash: string, range?: { start?: number | null; end?: number | null } | null) {
    // todo: we should throw an error if the file doesn't exist, at the moment
    // the entire app will crash.
    const filePath = this.getPathFromHash(hash);
    return fs.createReadStream(filePath, {
      start: range?.start ?? undefined,
      end: range?.end ?? undefined,
    });
  }

  getPathFromHash(hash: string) {
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
