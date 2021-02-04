import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { File, FileMetadata } from "../entities/File";

@Injectable()
export class FileService {
  private static readonly METADATA_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ]);

  /**
   * Remove extensions, etc from a file key.
   */
  public cleanFileKey(key: string): { id: string; ext?: string } {
    const groups = /^(?<id>[a-z0-9]+)(?:\.(?<ext>[a-z]{3,4}))?$/.exec(key)?.groups;
    if (!groups) throw new BadRequestException("Invalid file key");
    return groups as any;
  }

  /**
   * Reply to a request with the given file.
   */
  public async sendFile(file: File, reply: FastifyReply) {
    if (!file.data) throw new InternalServerErrorException("Missing file data");
    reply.header("Content-Length", file.size);
    reply.header("Last-Modified", file.createdAt.toUTCString());
    reply.header("Content-Type", file.type);
    reply.header("X-Micro-FileId", file.id);
    reply.header("X-Micro-ThumbnailId", file.thumbnailId);
    reply.header("X-Micro-OwnerId", file.ownerId);
    if (file.name) {
      reply.header("Content-Disposition", `inline; filename="${file.name}"`);
    }

    reply.send(file.data);

    // increment view count
    const fileRepo = getRepository(File);
    await fileRepo.increment({ id: file.id }, "views", 1);
  }

  /**
   * Reply to a request with the given file by file id.
   */
  public async sendFileById(id: string, reply: FastifyReply) {
    const fileRepo = getRepository(File);
    const file = await fileRepo.findOne(id, {
      select: ["size", "createdAt", "type", "id", "owner", "name", "data"],
    });

    if (!file) throw new NotFoundException();
    return this.sendFile(file, reply);
  }

  /**
   * Extract metadata for the file to store alongside it.
   */
  public async getMetadata(file: File): Promise<FileMetadata | undefined> {
    if (file.metadata) return file.metadata;
    if (!file.data) throw new InternalServerErrorException("Missing file data");
    if (!FileService.METADATA_TYPES.has(file.type)) return;
    const metadata = await sharp(file.data).metadata();
    return {
      height: metadata.height,
      width: metadata.width,
    };
  }
}
