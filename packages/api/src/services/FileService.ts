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
import { PassThrough } from "stream";
import { getRepository } from "typeorm";
import { config } from "../config";
import { File } from "../entities/File";
import { getStreamType } from "../helpers/getStreamType";
import { S3Service } from "./S3Service";

@Injectable()
export class FileService {
  private static readonly FILE_KEY_REGEX = /^(?<id>[a-z0-9]+)(?:\.(?<ext>[a-z0-9]{2,4}))?$/;
  constructor(private s3Service: S3Service) {}

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

    const stream = multipart.file.pipe(new ExifBeGone());
    const typeStream = stream.pipe(new PassThrough());
    const uploadStream = stream.pipe(new PassThrough());
    const type = (await getStreamType(multipart.filename, typeStream)) ?? multipart.mimetype;
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

    file.addId(); // required to get storage key
    file.size = await this.s3Service.uploadFile(uploadStream, {
      Key: file.storageKey,
      ContentType: file.type,
      ContentDisposition: `inline; filename="${file.displayName}"`,
    });

    await fileRepo.save(file);
    return file;
  }

  public async sendFile(fileId: string, reply: FastifyReply) {
    const fileRepo = getRepository(File);
    const file = fileRepo.create({ id: fileId });
    return this.s3Service.sendFile(file.storageKey, reply);
  }
}
