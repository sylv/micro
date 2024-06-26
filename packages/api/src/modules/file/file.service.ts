import type { MultipartFile } from "@fastify/multipart";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
} from "@nestjs/common";
import bytes from "bytes";
import * as contentRange from "content-range";
import type { FastifyReply, FastifyRequest } from "fastify";
import ffmpeg from "fluent-ffmpeg";
import { DateTime } from "luxon";
import mime from "mime-types";
import sharp from "sharp";
import { PassThrough } from "stream";
import { config, type MicroHost } from "../../config.js";
import { generateContentId } from "../../helpers/generate-content-id.helper.js";
import { getStreamType } from "../../helpers/get-stream-type.helper.js";
import { HostService } from "../host/host.service.js";
import { StorageService } from "../storage/storage.service.js";
import type { UserEntity } from "../user/user.entity.js";
import { FileEntity } from "./file.entity.js";

@Injectable()
export class FileService {
  @InjectRepository("FileEntity") private fileRepo: EntityRepository<FileEntity>;

  private readonly logger = new Logger(FileService.name);
  constructor(
    private storageService: StorageService,
    private hostService: HostService,
    protected readonly orm: MikroORM,
    private em: EntityManager,
  ) {}

  async getFile(id: string, request: FastifyRequest) {
    const file = await this.fileRepo.findOneOrFail(id, { populate: ["owner"] });
    if (!file.canSendTo(request)) {
      throw new NotFoundException("Your file is in another castle.");
    }

    return file;
  }

  async createFile(
    multipart: MultipartFile,
    request: FastifyRequest,
    owner: UserEntity,
    host: MicroHost | undefined,
  ): Promise<FileEntity> {
    if (host) this.hostService.checkUserCanUploadTo(host, owner);
    if (!request.headers["content-length"]) throw new BadRequestException('Missing "Content-Length" header.');
    const contentLength = Number(request.headers["content-length"]);
    if (Number.isNaN(contentLength) || contentLength >= config.uploadLimit) {
      const size = bytes.parse(Number(request.headers["content-length"]));
      this.logger.warn(
        `User ${owner.id} tried uploading a ${size} file, which is over the configured upload size limit.`,
      );

      throw new PayloadTooLargeException();
    }

    const stream = multipart.file;
    const typeStream = stream.pipe(new PassThrough());
    let uploadStream = stream.pipe(new PassThrough());
    const fileType = (await getStreamType(multipart.filename, typeStream)) ?? multipart.mimetype;
    if (config.allowTypes && !config.allowTypes.has(fileType)) {
      throw new BadRequestException(`"${fileType}" is not supported by this server.`);
    }

    const conversion = config.conversions?.find((conversion) => {
      if (!conversion.from.has(fileType)) return false;
      if (conversion.minSize && contentLength < conversion.minSize) return false;
      if (conversion.to === fileType) return false; // dont convert to the same type
      return true;
    });

    if (conversion) {
      this.logger.debug(`Converting ${fileType} to ${conversion.to}`);
      const fromGroup = fileType.split("/")[0];
      const toGroup = conversion.to.split("/")[0];
      if (fromGroup !== toGroup && fileType !== "image/gif") {
        throw new Error(`Cannot convert from ${fromGroup} to ${toGroup}`);
      }

      switch (toGroup) {
        case "video": {
          let fromFormat = fileType.split("/")[1];
          if (fromFormat === "gif") {
            // ffmpeg doesnt support piping gifs unless "gif_pipe" is the input format.
            // you have no idea how long it took to discover this.
            fromFormat = "gif_pipe";
          }

          const toFormat = conversion.to.split("/")[1];
          const transcodeStream = new PassThrough();

          ffmpeg()
            .input(uploadStream)
            .fromFormat(fromFormat)
            .toFormat(toFormat)
            .writeToStream(transcodeStream, { end: true });

          uploadStream = transcodeStream;
          break;
        }
        case "image": {
          const toFormat = conversion.to.split("/")[1];
          if (!(toFormat in sharp.format)) {
            throw new Error(`Unknown or unsupported image format ${toFormat}`);
          }

          // pages: -1 enables support to convert gif to webp without it being a static image
          const transformer = sharp({ pages: -1 }).toFormat(toFormat as any, {
            effort: 3,
            quality: 70,
            progressive: true,
          });

          uploadStream = uploadStream.pipe(transformer).pipe(new PassThrough());
          break;
        }
        default: {
          throw new Error(`Unknown or unsupported conversion ${fromGroup} to ${toGroup}`);
        }
      }
    }

    const fileId = generateContentId();
    const { hash, size, metadata } = await this.storageService.create(uploadStream);
    const file = this.fileRepo.create({
      id: fileId,
      type: fileType,
      name: multipart.filename,
      owner: owner.id,
      hostname: host?.normalised.replace("{{username}}", owner.username),
      hash: hash,
      size: size,
    });

    if (metadata) {
      file.metadata = {
        width: metadata.width,
        height: metadata.height,
      };
    }

    if (conversion) {
      // swap the file type to the new mime type
      const originalExtension = mime.extension(file.type);
      file.type = conversion.to;
      const conversionExtension = mime.extension(conversion.to);
      if (file.name && originalExtension && conversionExtension) {
        // "fix" extensions in the ile name, eg "Test.png" > "Test.webp"
        file.name = file.name.replace(`.${originalExtension}`, `.${conversionExtension}`);
      }
    }

    await this.em.persistAndFlush(file);
    return file;
  }

  async sendFile(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const file = await this.getFile(fileId, request);
    const range = request.headers["content-range"]
      ? contentRange.parse(request.headers["content-range"])
      : null;

    const stream = await this.storageService.createReadStream(file, range);
    if (range) await reply.header("Content-Range", contentRange.format(range));

    file.views++;
    await this.em.persistAndFlush(file);

    const type = file.type.startsWith("text") ? `${file.type}; charset=UTF-8` : file.type;
    return reply
      .header("ETag", `"${file.hash}"`)
      .header("Accept-Ranges", "bytes")
      .header("Content-Type", type)
      .header("Content-Length", file.size)
      .header("Last-Modified", file.createdAt)
      .header("Content-Disposition", `inline; filename="${file.getDisplayName()}"`)
      .header("Cache-Control", "public, max-age=31536000")
      .header("Expires", DateTime.local().plus({ years: 1 }).toHTTP())
      .header("X-Content-Type-Options", "nosniff")
      .send(stream);
  }
}
