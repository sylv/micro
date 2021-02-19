import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { FastifyReply } from "fastify";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { config } from "../config";
import { File, FileMetadata } from "../entities/File";
import { getTypeFromExtension } from "../helpers/getTypeFromExtension";
import { streamToBuffer } from "../helpers/streamToBuffer";
import { ThumbnailService } from "./ThumbnailService";
import ExifBeGone from "exif-be-gone";
import { bufferToStream } from "../helpers/bufferToStream";

@Injectable()
export class FileService {
  private static readonly FILE_KEY_REGEX = /^(?<id>[a-z0-9]+)(?:\.(?<ext>[a-z0-9]{2,4}))?$/;
  private static readonly METADATA_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]);

  constructor(protected thumbnailService: ThumbnailService) {}

  public cleanFileKey(key: string): { id: string; ext?: string } {
    const groups = FileService.FILE_KEY_REGEX.exec(key)?.groups;
    if (!groups) throw new BadRequestException("Invalid file key");
    return groups as any;
  }

  public getFile(id: string) {
    const fileRepo = getRepository(File);
    return fileRepo.findOne(id);
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

  public async createFile(data: Buffer, fileName: string, mimeType: string, ownerId: string): Promise<File> {
    const mappedType = await getTypeFromExtension(fileName, data);
    const type = mappedType || mimeType;
    if (config.allowTypes?.includes(type) === false) {
      throw new BadRequestException(`"${type}" is not supported by this server.`);
    }

    const stripExif = new ExifBeGone();
    const withoutExif = await streamToBuffer(bufferToStream(data).pipe(stripExif));
    const fileRepo = getRepository(File);
    const file = fileRepo.create({
      type: type,
      name: fileName,
      size: withoutExif.length,
      data: withoutExif,
      owner: {
        id: ownerId,
      },
    });

    file.metadata = await this.createFileMetadata(file);
    file.thumbnail = await this.thumbnailService.createThumbnail(file);
    await fileRepo.save(file);
    return file;
  }

  protected async createFileMetadata(file: File): Promise<FileMetadata | undefined> {
    if (file.metadata) return file.metadata;
    if (!file.data) throw new InternalServerErrorException("Missing file data");
    if (!FileService.METADATA_TYPES.has(file.type)) return;
    const metadata = await sharp(file.data).metadata();
    return {
      height: metadata.height,
      width: metadata.width,
      isProgressive: metadata.isProgressive,
      // todo: this is true for images with no transparency, which is annoying
      hasAlpha: metadata.hasAlpha,
    };
  }

  public async sendFile(id: string, reply: FastifyReply): Promise<void> {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne(id, {
      // https://github.com/typeorm/typeorm/issues/6362
      select: ["id", "size", "type", "name", "data", "createdAt"],
    });

    if (!file) {
      throw new NotFoundException();
    }

    // todo: Accept-Range
    reply.header("Content-Length", file.size);
    reply.header("Last-Modified", file.createdAt.toUTCString());
    reply.header("Content-Type", file.type);
    reply.header("X-Micro-FileId", file.id);
    reply.header("X-Micro-ThumbnailId", file.thumbnailId);
    if (file.name) {
      reply.header("Content-Disposition", `inline; filename="${file.name}"`);
    }

    await reply.send(file.data);
    await fileRepo.increment({ id: file.id }, "views", 1);
  }
}
