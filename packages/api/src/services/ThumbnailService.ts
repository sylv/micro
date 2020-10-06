import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import sharp from "sharp";
import { getRepository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";
import { File, FileCategory } from "../entities/File";
import { User } from "../entities/User";
import { s3 } from "../driver";

export const THUMBNAIL_SUPPORTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg"];
export const THUMBNAIL_SIZE = 200;

@Injectable()
export class ThumbnailService {
  private log = new Logger(ThumbnailService.name);

  async generateThumbnail(file: File) {
    if (!file.supports_thumbnails) throw new BadRequestException("File does not support thumbnails.");
    if (file.parent_id) throw new BadRequestException("Cannot generate thumbnails of thumbnails.");
    if (file.thumbnail ?? file.thumbnail_id) {
      throw new InternalServerErrorException("Thumbnail already exists for image");
    }

    const start = Date.now();
    const fileRepo = getRepository(File);
    const fileStream = s3.getObject({ Bucket: config.s3.bucket, Key: file.storage_key }).createReadStream();
    const generator = sharp().resize(THUMBNAIL_SIZE).jpeg();
    const thumbnail = new File();
    thumbnail.id = uuidv4();
    thumbnail.mime_type = "image/jpeg";
    thumbnail.owner = { id: file.owner_id } as User;
    thumbnail.original_name = file.original_name ? `${file.original_name}-thumb.jpg` : null;
    thumbnail.size_bytes = 0;
    thumbnail.parent = file;
    thumbnail.parent_id = file.id;
    thumbnail.category = FileCategory.THUMBNAIL;
    file.thumbnail = thumbnail;
    file.thumbnail_id = thumbnail.id;
    const thumbStream = fileStream.pipe(generator).on("data", (chunk) => (thumbnail.size_bytes += chunk.length));
    await s3.upload({ Bucket: config.s3.bucket, Key: thumbnail.storage_key, Body: thumbStream }).promise();
    await fileRepo.save(thumbnail);
    const time = Date.now() - start;
    this.log.debug(`Generated thumbnail for ${file.id} in ${time}ms`);
    return thumbnail;
  }
}
