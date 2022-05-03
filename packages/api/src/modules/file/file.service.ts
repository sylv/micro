import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
  PayloadTooLargeException,
  UnauthorizedException,
} from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import contentRange from "content-range";
import { FastifyReply, FastifyRequest } from "fastify";
import { Multipart } from "@fastify/multipart";
import { DateTime } from "luxon";
import { PassThrough } from "stream";
import xbytes from "xbytes";
import { MicroHost } from "../../classes/MicroHost";
import { config } from "../../config";
import { contentIdLength, generateContentId } from "../../helpers/generate-content-id.helper";
import { getStreamType } from "../../helpers/get-stream-type.helper";
import { HostsService } from "../hosts/hosts.service";
import { StorageService } from "../storage/storage.service";
import { File } from "./file.entity";

@Injectable()
export class FileService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FileService.name);
  constructor(
    @InjectRepository(File) private fileRepo: EntityRepository<File>,
    private storageService: StorageService,
    private hostsService: HostsService
  ) {}

  async getFile(id: string, host: MicroHost) {
    const file = await this.fileRepo.findOne(id);
    if (!file) throw new NotFoundException(`Unknown file "${id}"`);
    if (!this.hostsService.checkHostCanSendFile(file, host)) {
      throw new NotFoundException("Your file is in another castle.");
    }

    return file;
  }

  async deleteFile(id: string, ownerId: string | null) {
    const file = await this.fileRepo.findOne(id);
    if (!file) throw new NotFoundException();
    if (ownerId && file.owner.id !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
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
    owner: { id: string; tags?: string[] },
    host: MicroHost | undefined
  ): Promise<File> {
    if (!request.headers["content-length"]) throw new BadRequestException('Missing "Content-Length" header.');
    if (+request.headers["content-length"] >= config.uploadLimit) {
      const size = xbytes(+request.headers["content-length"]);
      this.logger.warn(
        `User ${owner.id} tried uploading a ${size} file, which is over the configured upload size limit.`
      );
      throw new PayloadTooLargeException();
    }

    const stream = multipart.file;
    const typeStream = stream.pipe(new PassThrough());
    const uploadStream = stream.pipe(new PassThrough());
    const type = (await getStreamType(multipart.filename, typeStream)) ?? multipart.mimetype;
    if (config.allowTypes?.includes(type) === false) {
      throw new BadRequestException(`"${type}" is not supported by this server.`);
    }

    const fileId = generateContentId();
    const { hash, size } = await this.storageService.create(uploadStream);
    const file = this.fileRepo.create({
      id: fileId,
      type: type,
      name: multipart.filename,
      owner: owner.id,
      host: host?.key,
      hash: hash,
      size: size,
    });

    await this.fileRepo.persistAndFlush(file);
    return file;
  }

  async sendFile(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const file = await this.getFile(fileId, request.host);
    const range = request.headers["content-range"] ? contentRange.parse(request.headers["content-range"]) : null;
    const stream = this.storageService.createReadStream(file.hash, range);
    if (range) reply.header("Content-Range", contentRange.format(range));
    const type = file.type.startsWith("text") ? `${file.type}; charset=UTF-8` : file.type;
    return reply
      .header("ETag", `"${file.hash}"`)
      .header("Accept-Ranges", "bytes")
      .header("Content-Type", type)
      .header("Content-Length", file.size)
      .header("Last-Modified", file.createdAt)
      .header("Content-Disposition", `inline; filename="${file.displayName}"`)
      .send(stream);
  }

  @Cron(CronExpression.EVERY_HOUR)
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
