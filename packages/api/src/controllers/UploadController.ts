import { BadRequestException, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { config } from "../config";
import { File } from "../entities/File";
import { TokenAuthGuard } from "../guards/TokenAuthGuard";
import { FileService } from "../services/FileService";
import { LinkService } from "../services/LinkService";
import { ThumbnailService } from "../services/ThumbnailService";

@Controller("upload")
export class UploadController {
  constructor(
    readonly fileService: FileService,
    readonly thumbnailService: ThumbnailService,
    readonly linkService: LinkService
  ) {}

  @Post()
  @UseGuards(TokenAuthGuard)
  async uploadFile(@Req() request: FastifyRequest<{ Querystring: { input?: string } }>) {
    // todo: upload size limiting https://github.com/fastify/fastify-multipart/issues/196
    // todo: strip exif data from uploads
    const upload = await request.file();
    if (!upload) {
      // handle shortening urls
      const url = request.query.input;
      if (!url || !url.startsWith("http")) throw new BadRequestException("Could not determine upload format");
      const link = await this.linkService.createLink(url, request.user);
      return {
        download: link.url,
        delete: `${link.url}?delete=${link.deletionId}`,
      };
    }

    if (!config.allowTypes.includes(upload.mimetype)) {
      throw new BadRequestException(`"${upload.mimetype}" is not supported by this server.`);
    }

    const fileRepo = getRepository(File);
    const data = await upload.toBuffer();
    const file = fileRepo.create({
      type: upload.mimetype,
      name: upload.filename,
      size: data.length,
      data: data,
      owner: {
        id: request.user,
      },
    });

    file.metadata = await this.fileService.getMetadata(file);
    file.thumbnail = await this.thumbnailService.generateThumbnail(file);
    await fileRepo.save(file);
    return Object.assign(file.url, {
      delete: `${file.url.download}?delete=${file.deletionId}`,
    });
  }
}
