import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnauthorizedException,
} from "@nestjs/common";
import ExifBeGone from "exif-be-gone";
import { FastifyReply, FastifyRequest } from "fastify";
import { Multipart } from "fastify-multipart";
import fs from "fs";
import os from "os";
import path from "path";
import stream from "stream";
import { getRepository } from "typeorm";
import { promisify } from "util";
import { config } from "../config";
import { File } from "../entities/File";
import { generateId } from "../helpers/generateId";
import { getFileType } from "../helpers/getFileType";
import { S3Service } from "./S3Service";
import { ThumbnailService } from "./ThumbnailService";

const pipeline = promisify(stream.pipeline);

@Injectable()
export class FileService {
  private static readonly FILE_KEY_REGEX = /^(?<id>[a-z0-9]+)(?:\.(?<ext>[a-z0-9]{2,4}))?$/;
  constructor(protected thumbnailService: ThumbnailService, protected s3Service: S3Service) {}

  public cleanFileKey(key: string): { id: string; ext?: string } {
    const groups = FileService.FILE_KEY_REGEX.exec(key)?.groups;
    if (!groups) throw new BadRequestException("Invalid file key");
    return groups as any;
  }

  public async getFile(id: string) {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne(id);
    if (!file) throw new NotFoundException();
    return file;
  }

  public async deleteFile(id: string, ownerId: string) {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne(id);
    if (!file) throw new NotFoundException();
    if (ownerId && file.ownerId !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
    }

    await fileRepo.remove(file);
  }

  public async createFile(multipart: Multipart, request: FastifyRequest, ownerId: string): Promise<File> {
    if (!request.headers["content-length"]) throw new BadRequestException('Missing "Content-Length" header.');
    if (+request.headers["content-length"] >= config.uploadLimit) {
      throw new PayloadTooLargeException();
    }

    // i know using temporary files is shitty but streams are a nightmare otherwise
    const uploadId = generateId(16);
    const uploadPath = path.join(os.tmpdir(), `__micro${uploadId}`);

    try {
      const stream = fs.createWriteStream(uploadPath);
      await pipeline(multipart.file, new ExifBeGone(), stream);
      const type = (await getFileType(uploadPath, multipart.filename)) || multipart.mimetype;
      if (config.allowTypes?.includes(type) === false) {
        throw new BadRequestException(`"${type}" is not supported by this server.`);
      }

      const fileRepo = getRepository(File);
      const file = fileRepo.create({
        type: type,
        name: multipart.filename,
        owner: {
          id: ownerId,
        },
      });

      file.addId(); // required to get storage key and to gen thumbnail
      file.thumbnail = await this.thumbnailService.createThumbnail(fs.createReadStream(uploadPath), file);
      file.size = await this.s3Service.uploadFile(fs.createReadStream(uploadPath), {
        Key: file.storageKey,
        ContentType: file.type,
        ContentDisposition: `inline; filename="${file.displayName}"`,
      });

      await fileRepo.save(file);
      return file;
    } finally {
      await fs.promises.unlink(uploadPath);
    }
  }

  public async sendFile(fileId: string, reply: FastifyReply) {
    const fileRepo = getRepository(File);
    const file = fileRepo.create({ id: fileId });
    return this.s3Service.sendFile(file.storageKey, reply);
  }
}
