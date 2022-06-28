/* eslint-disable sonarjs/no-duplicate-string */
import type { Multipart } from '@fastify/multipart';
import { EntityRepository, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import type { OnApplicationBootstrap } from '@nestjs/common';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import contentRange from 'content-range';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { DateTime } from 'luxon';
import { PassThrough } from 'stream';
import xbytes from 'xbytes';
import type { MicroHost } from '../../classes/MicroHost';
import { config } from '../../config';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { getStreamType } from '../../helpers/get-stream-type.helper';
import { HostService } from '../host/host.service';
import { StorageService } from '../storage/storage.service';
import type { User } from '../user/user.entity';
import { File } from './file.entity';

@Injectable()
export class FileService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FileService.name);
  constructor(
    @InjectRepository(File) private readonly fileRepo: EntityRepository<File>,
    private readonly storageService: StorageService,
    private readonly hostService: HostService,
    private readonly orm: MikroORM
  ) {}

  async getFile(id: string, request: FastifyRequest) {
    const file = await this.fileRepo.findOneOrFail(id, { populate: ['owner'] });
    if (file.hostname && !file.canSendTo(request)) {
      throw new NotFoundException('Your file is in another castle.');
    }

    return file;
  }

  async deleteFile(id: string, ownerId: string | null, deleteKey?: string) {
    const file = await this.fileRepo.findOneOrFail(id);
    if (deleteKey && file.deleteKey !== deleteKey) {
      throw new UnauthorizedException('Invalid delete key.');
    }

    if (ownerId && file.owner.id !== ownerId) {
      throw new UnauthorizedException('You cannot delete other users files.');
    }

    // todo: this should use a subscriber for file delete events, should also do
    // the same for thumbnails or something ig
    const filesWithHash = await this.fileRepo.count({ hash: file.hash });
    if (filesWithHash === 1) {
      await this.storageService.delete(file.hash);
    }

    await this.fileRepo.removeAndFlush(file);
  }

  async createFile(
    multipart: Multipart,
    request: FastifyRequest,
    owner: User,
    host: MicroHost | undefined
  ): Promise<File> {
    if (host) this.hostService.checkUserCanUploadTo(host, owner);
    if (!request.headers['content-length']) throw new BadRequestException('Missing "Content-Length" header.');
    if (Number(request.headers['content-length']) >= config.uploadLimit) {
      const size = xbytes(Number(request.headers['content-length']));
      this.logger.warn(
        `User ${owner.id} tried uploading a ${size} file, which is over the configured upload size limit.`
      );
      throw new PayloadTooLargeException();
    }

    const stream = multipart.file;
    const typeStream = stream.pipe(new PassThrough());
    const uploadStream = stream.pipe(new PassThrough());
    const type = (await getStreamType(multipart.filename, typeStream)) ?? multipart.mimetype;
    if (config.allowTypes && !config.allowTypes.has(type)) {
      throw new BadRequestException(`"${type}" is not supported by this server.`);
    }

    const fileId = generateContentId();
    const { hash, size } = await this.storageService.create(uploadStream);
    const file = this.fileRepo.create({
      id: fileId,
      type: type,
      name: multipart.filename,
      owner: owner.id,
      hostname: host?.normalised.replace('{{username}}', owner.username),
      hash: hash,
      size: size,
    });

    await this.fileRepo.persistAndFlush(file);
    return file;
  }

  async sendFile(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const file = await this.getFile(fileId, request);
    const range = request.headers['content-range'] ? contentRange.parse(request.headers['content-range']) : null;
    const stream = this.storageService.createReadStream(file.hash, range);
    if (range) await reply.header('Content-Range', contentRange.format(range));
    const type = file.type.startsWith('text') ? `${file.type}; charset=UTF-8` : file.type;
    return reply
      .header('ETag', `"${file.hash}"`)
      .header('Accept-Ranges', 'bytes')
      .header('Content-Type', type)
      .header('Content-Length', file.size)
      .header('Last-Modified', file.createdAt)
      .header('Content-Disposition', `inline; filename="${file.displayName}"`)
      .header('Cache-Control', 'public, max-age=31536000')
      .header('Expires', DateTime.local().plus({ years: 1 }).toHTTP())
      .header('X-Content-Type-Options', 'nosniff')
      .send(stream);
  }

  @Cron(CronExpression.EVERY_HOUR)
  @UseRequestContext()
  async purgeFiles() {
    if (!config.purge) return;
    const createdBefore = new Date(Date.now() - config.purge.afterTime);

    const files = await this.fileRepo.find({
      size: {
        $gte: config.purge.overLimit,
      },
      createdAt: {
        $lte: createdBefore,
      },
    });

    for (const file of files) {
      const size = xbytes(file.size, { space: false });
      const age = DateTime.fromJSDate(file.createdAt).toRelative();
      await this.deleteFile(file.id, null);
      this.logger.log(`Purging ${file.id} (${size}, ${age})`);
    }

    if (files[0]) {
      this.logger.log(`Purged ${files.length} files`);
    }
  }

  onApplicationBootstrap() {
    if (config.purge) {
      const size = xbytes(config.purge.overLimit, { space: false });
      // todo: swap out luxon for dayjs
      const age = DateTime.local().minus(config.purge.afterTime).toRelative();
      this.logger.warn(`Purging files is enabled for files over ${size} uploaded more than ${age}.`);
    }
  }
}
