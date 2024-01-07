import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { once } from 'events';
import type { FastifyReply, FastifyRequest } from 'fastify';
import ffmpeg from 'fluent-ffmpeg';
import { readdir, readFile, rm, stat } from 'fs/promises';
import { DateTime } from 'luxon';
import mime from 'mime-types';
import { tmpdir } from 'os';
import { join } from 'path';
import sharp from 'sharp';
import type { File } from '../file/file.entity.js';
import { FileService } from '../file/file.service.js';
import { StorageService } from '../storage/storage.service.js';
import type { Thumbnail } from './thumbnail.entity.js';

@Injectable()
export class ThumbnailService {
  private static readonly THUMBNAIL_SIZE = 200;
  private static readonly THUMBNAIL_TYPE = 'image/webp';
  private static readonly IMAGE_TYPES = new Set(
    Object.keys(sharp.format)
      .map((key) => mime.lookup(key))
      .filter((key) => key && key.startsWith('image')),
  );

  private static readonly VIDEO_TYPES = new Set([
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/x-matroska',
    'video/x-ms-wmv',
    'video/x-m4v',
    'video/x-flv',
  ]);

  private readonly log = new Logger(ThumbnailService.name);

  constructor(
    @InjectRepository('Thumbnail') private readonly thumbnailRepo: EntityRepository<Thumbnail>,
    @InjectRepository('File') private readonly fileRepo: EntityRepository<File>,
    private readonly storageService: StorageService,
    private readonly fileService: FileService,
  ) {}

  async getThumbnail(fileId: string) {
    return this.thumbnailRepo.findOneOrFail(fileId);
  }

  async createThumbnail(file: File) {
    const start = Date.now();

    let data: Buffer;
    if (ThumbnailService.IMAGE_TYPES.has(file.type)) {
      data = await this.createImageThumbnail(file);
    } else if (ThumbnailService.VIDEO_TYPES.has(file.type)) {
      data = await this.createVideoThumbnail(file);
    } else {
      throw new BadRequestException('That file type does not support thumbnails.');
    }

    // todo: ideally we could extract both file and thumbnail metadata during
    // thumbnail generation, saving two additional file reads.
    const thumbnailMetadata = await sharp(data).metadata();

    if (ThumbnailService.IMAGE_TYPES.has(file.type)) {
      // todo: this should probably be done elsewhere, this is just a convenient
      // time to grab this data.
      const filePath = this.storageService.getPathFromHash(file.hash);
      const fileMetadata = await sharp(filePath).metadata();
      file.metadata = { height: fileMetadata.height, width: fileMetadata.width };
    }

    const duration = Date.now() - start;
    const thumbnail = this.thumbnailRepo.create({
      data: data,
      duration: duration,
      size: data.length,
      type: ThumbnailService.THUMBNAIL_TYPE,
      width: thumbnailMetadata.width!,
      height: thumbnailMetadata.height!,
      file: file,
    });

    this.fileRepo.persist(file);
    this.thumbnailRepo.persist(thumbnail);
    await this.thumbnailRepo.flush();
    return thumbnail;
  }

  private async createImageThumbnail(file: File) {
    const supported = ThumbnailService.IMAGE_TYPES.has(file.type);
    if (!supported) throw new Error('Unsupported image type.');
    this.log.debug(`Generating thumbnail for ${file.id} (${file.type})`);
    const filePath = this.storageService.getPathFromHash(file.hash);
    return sharp(filePath).resize(ThumbnailService.THUMBNAIL_SIZE).toFormat('webp').toBuffer();
  }

  private async createVideoThumbnail(file: File) {
    const supported = ThumbnailService.VIDEO_TYPES.has(file.type);
    if (!supported) throw new Error('Unsupported video type.');

    const tempId = randomUUID();
    const tempDir = join(tmpdir(), `.thumbnail-workspace-${tempId}`);
    const filePath = this.storageService.getPathFromHash(file.hash);
    this.log.debug(`Generating video thumbnail at "${tempDir}"`);

    // i have no clue why but the internet told me that doing it in multiple invocations is faster
    // and it is so whatever. maybe there is a way to do this faster, but this is already pretty fast.
    const positions = ['5%', '10%', '20%', '40%'];
    const size = `${ThumbnailService.THUMBNAIL_SIZE}x?`;
    for (let positionIndex = 0; positionIndex < positions.length; positionIndex++) {
      const percent = positions[positionIndex];
      const stream = ffmpeg(filePath).screenshot({
        count: 1,
        timemarks: [percent],
        folder: tempDir,
        size: size,
        fastSeek: true,
        filename: `%b-${positionIndex + 1}.webp`,
      });

      await once(stream, 'end');
    }

    const files = await readdir(tempDir);
    let largest: { size: number; path: string } | undefined;
    for (const file of files) {
      const path = join(tempDir, file);
      const stats = await stat(path);
      if (!largest || stats.size > largest.size) {
        largest = { size: stats.size, path };
      }
    }

    if (!largest) {
      await rm(tempDir, { recursive: true, force: true });
      throw new Error('No thumbnails were generated');
    }

    this.log.debug(`Largest thumbnail is at "${largest.path}", ${largest.size} bytes`);
    const content = await readFile(largest.path);
    await rm(tempDir, { recursive: true, force: true });
    return content;
  }

  static checkSupport(fileType: string) {
    return ThumbnailService.IMAGE_TYPES.has(fileType) || ThumbnailService.VIDEO_TYPES.has(fileType);
  }

  async sendThumbnail(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const existing = await this.thumbnailRepo.findOne(fileId, { populate: ['data'] });
    if (existing) {
      return reply
        .header('X-Micro-Generated', 'false')
        .header('Content-Type', ThumbnailService.THUMBNAIL_TYPE)
        .header('Cache-Control', 'public, max-age=31536000')
        .header('Expires', DateTime.local().plus({ years: 1 }).toHTTP())
        .header('X-Content-Type-Options', 'nosniff')
        .send(existing.data);
    }

    const file = await this.fileService.getFile(fileId, request);
    const thumbnail = await this.createThumbnail(file);
    return reply
      .header('X-Micro-Generated', 'true')
      .header('X-Micro-Duration', thumbnail.duration)
      .header('Content-Type', ThumbnailService.THUMBNAIL_TYPE)
      .send(thumbnail.data);
  }
}
