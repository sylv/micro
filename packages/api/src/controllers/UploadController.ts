import { BadRequestException, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import getFileType from "file-type";
import stream from "stream";
import { getRepository } from "typeorm";
import { config } from "../config";
import { File } from "../entities/File";
import { User } from "../entities/User";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { s3 } from "../driver";
import { v4 as uuidv4 } from "uuid";

@Controller("upload")
export class UploadController {
  @UseGuards(JWTAuthGuard)
  @Post()
  async uploadFile(@Req() request: FastifyRequest) {
    // todo: request limits
    const uploadMeta = await request.file();
    const upload = await getFileType.stream(uploadMeta.file as stream.Readable);
    const uploadMime = upload.fileType?.mime ?? (uploadMeta.mimetype === 'text/plain' ? uploadMeta.mimetype : "application/octet-stream"); // prettier-ignore
    if (!config.allow_types.includes(uploadMime)) {
      throw new BadRequestException(`Unsupported content type "${uploadMime}"`);
    }

    const fileRepo = getRepository(File);
    const file = new File();
    file.id = uuidv4();
    file.mime_type = uploadMime;
    file.size_bytes = 0;
    file.owner = { id: request.user! } as User;
    file.original_name = uploadMeta.filename ?? null;
    upload.on("data", (chunk) => (file.size_bytes += chunk.length));
    upload.pause();
    await s3.upload({ Bucket: config.s3.bucket, Key: file.storage_key, Body: upload }).promise();
    // todo: handle duplicate error keys gracefully (thumbnails too)
    await fileRepo.save(file);
    return file.getUrls(request.headers.host);
  }
}
