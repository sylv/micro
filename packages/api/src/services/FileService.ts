import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Readable } from "stream";
import { getRepository } from "typeorm";
import { File, FileMetadata } from "../entities/File";
import sharp from "sharp";

export interface GetFileStream {
  stream: Readable | null;
  headers: Record<string, string | string[]>;
}

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
    reply.header("Content-Length", file.size);
    reply.header("Last-Modified", file.createdAt.toUTCString());
    reply.header("Content-Type", file.type);
    reply.header("X-Micro-FileId", file.id);
    reply.header("X-Micro-OwnerId", file.ownerId);
    if (file.name) reply.header("Content-Disposition", `inline; filename="${file.name}"`);
    if (file.data) {
      reply.send(file.data);
    } else {
      const fileRepo = getRepository(File);
      const data = (await fileRepo.findOne(file.id, { select: ["data"] }))?.data;
      reply.send(data);
    }
  }

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
