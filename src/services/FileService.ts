import { Injectable } from "@nestjs/common";
import { FastifyReply } from "fastify";
import fs from "fs";
import { cachePath, config } from "../config";
import { File } from "../entities/File";
import { s3 } from "../s3";

@Injectable()
export class FileService {
  constructor() {
    fs.mkdirSync(cachePath, { recursive: true });
  }

  /**
   * Remove extensions, etc from a file key.
   */
  cleanFileKey(key: string) {
    return key.replace(/\.[a-z]{3,4}$/, "");
  }

  /**
   * Reply to a request with the given file.
   */
  async sendFile(file: File, reply: FastifyReply) {
    const stream = s3.getObject({ Bucket: config.s3.bucket, Key: file.storage_key }).createReadStream();
    reply.header("Content-Type", file.mime_type);
    reply.header("Content-Length", file.size_bytes);
    reply.header("X-Micro-OwnerId", file.owner_id ?? file.owner?.id);
    reply.header("X-Micro-FileId", file.id);
    if (file.original_name) {
      reply.header("Content-Disposition", `inline; filename="${file.original_name}"`);
    }

    return reply.send(stream);
  }
}
