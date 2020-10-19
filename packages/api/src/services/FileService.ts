import { Injectable, NotFoundException } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { Readable } from "stream";
import { getRepository } from "typeorm";
import { config } from "../config";
import { s3 } from "../driver";
import { File } from "../entities/File";

export interface GetFileStream {
  stream: Readable | null;
  headers: Record<string, string | string[]>;
}

@Injectable()
export class FileService {
  /**
   * Remove extensions, etc from a file key.
   */
  cleanFileKey(key: string) {
    return key.replace(/\.[a-z]{3,4}$/, "");
  }

  /**
   * Get a file stream. If stream=null the object no longer exists in s3.
   * @param file The file to get the stream for
   */
  getFileStream(file: File) {
    return new Promise<GetFileStream>((resolve, reject) => {
      if (file.deleted) return resolve({ stream: null, headers: {} });
      const stream: Readable = s3
        .getObject({ Bucket: config.s3.bucket, Key: file.storage_key })
        .on("error", reject)
        .on("httpHeaders", (status, headers) => {
          if (status === 404) {
            resolve({ stream: null, headers: {} });
            if (!file.deleted) {
              file.deleted = true;
              const fileRepo = getRepository(File);
              fileRepo.save(file);
            }

            return;
          }
          if (status !== 200) return; // error will be thrown
          return resolve({ stream, headers });
        })
        .createReadStream()
        .on("error", reject);
    });
  }

  /**
   * Reply to a request with the given file.
   */
  async sendFile(file: File, reply: FastifyReply) {
    const { stream, headers } = await this.getFileStream(file);
    if (!stream) throw new NotFoundException("That file no longer exists.");
    reply.header("ETag", headers.etag);
    reply.header("Content-Length", headers["content-length"]);
    reply.header("Last-Modified", headers["last-modified"]);
    reply.header("Content-Type", file.mime_type);
    reply.header("X-Micro-OwnerId", file.owner_id ?? file.owner?.id);
    reply.header("X-Micro-FileId", file.id);
    if (file.original_name) {
      reply.header("Content-Disposition", `inline; filename="${file.original_name}"`);
    }

    reply.send(stream);
  }
}
