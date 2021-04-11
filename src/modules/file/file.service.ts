import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
  UnauthorizedException,
} from "@nestjs/common";
import { File } from "@prisma/client";
import contentRange from "content-range";
import { FastifyReply, FastifyRequest } from "fastify";
import { Multipart } from "fastify-multipart";
import mimeType from "mime-types";
import { PassThrough } from "stream";
import { config } from "../../config";
import { EMBEDDABLE_IMAGE_TYPES } from "../../constants";
import { getStreamType } from "../../helpers/getStreamType";
import { shortId, shortIdLength } from "../../helpers/shortId";
import { prisma } from "../../prisma";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class FileService {
  private static readonly FILE_KEY_REGEX = new RegExp(`^(?<id>.{${shortIdLength}})(?<ext>\\.[A-z0-9]{2,})?$`);
  constructor(private storageService: StorageService) {}

  public cleanKey(key: string): { id: string; ext?: string } {
    const groups = FileService.FILE_KEY_REGEX.exec(key)?.groups;
    if (!groups) throw new BadRequestException("Invalid file key");
    return groups as any;
  }

  public async get(id: string) {
    const file = await prisma.file.findFirst({ where: { id } });
    if (!file) throw new NotFoundException();
    return Object.assign(file, {
      displayName: this.getDisplayName(file),
      urls: this.getUrls(file),
    });
  }

  public async delete(id: string, ownerId: string | undefined) {
    const file = await prisma.file.findFirst({ where: { id } });
    if (!file) throw new NotFoundException();
    if (ownerId && file.ownerId !== ownerId) {
      throw new UnauthorizedException("You cannot delete other users files.");
    }

    await this.storageService.delete(file.hash);
    await prisma.file.delete({ where: { id: file.id } });
  }

  public async create(multipart: Multipart, request: FastifyRequest, ownerId: string): Promise<File> {
    if (!request.headers["content-length"]) throw new BadRequestException('Missing "Content-Length" header.');
    if (+request.headers["content-length"] >= config.uploadLimit) {
      throw new PayloadTooLargeException();
    }

    const stream = multipart.file;
    const typeStream = stream.pipe(new PassThrough());
    const uploadStream = stream.pipe(new PassThrough());
    const type = (await getStreamType(multipart.filename, typeStream)) ?? multipart.mimetype;
    if (config.allowTypes?.includes(type) === false) {
      throw new BadRequestException(`"${type}" is not supported by this server.`);
    }

    const fileId = shortId();
    const { hash, size } = await this.storageService.create(uploadStream);
    const file = await prisma.file.create({
      data: {
        id: fileId,
        type: type,
        name: multipart.filename,
        ownerId: ownerId,
        hash: hash,
        size: size,
      },
    });

    return file;
  }

  public async send(fileId: string, request: FastifyRequest, reply: FastifyReply) {
    const file = await prisma.file.findFirst({
      where: { id: fileId },
      select: {
        id: true,
        name: true,
        hash: true,
        type: true,
        size: true,
        createdAt: true,
      },
    });

    if (!file) throw new NotFoundException();
    const range = request.headers["content-range"] ? contentRange.parse(request.headers["content-range"]) : null;
    const displayName = this.getDisplayName(file);
    const stream = this.storageService.createReadStream(file.hash, range);
    if (range) reply.header("Content-Range", contentRange.format(range));
    return reply
      .header("ETag", `"${file.hash}"`)
      .header("Accept-Ranges", "bytes")
      .header("Content-Type", file.type)
      .header("Content-Length", file.size)
      .header("Last-Modified", file.createdAt)
      .header("Content-Disposition", `inline; filename="${displayName}"`)
      .send(stream);
  }

  public getDisplayName(file: Pick<File, "type" | "id" | "name">) {
    if (!file.id) throw new Error("Missing file ID");
    const extension = mimeType.extension(file.type);
    return file.name ? file.name : extension ? `${file.id}.${extension}` : file.id;
  }

  public getUrls(file: Pick<File, "id" | "type">) {
    const extension = mimeType.extension(file.type);
    const supportsThumbnail = EMBEDDABLE_IMAGE_TYPES.includes(file.type);
    const view = `/f/${file.id}`;
    const direct = `/f/${file.id}.${extension}`;
    const metadata = `/api/file/${file.id}`;
    const thumbnail = supportsThumbnail ? `/t/${file.id}` : null;
    return { view, direct, metadata, thumbnail };
  }
}
