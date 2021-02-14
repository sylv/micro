import { BadRequestException, Controller, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { config } from "../config";
import { File } from "../entities/File";
import { TokenAuthGuard } from "../guards/TokenAuthGuard";
import { getTypeFromExtension } from "../helpers/getTypeFromExtension";
import { FileService } from "../services/FileService";
import { LinkService } from "../services/LinkService";
import { ThumbnailService } from "../services/ThumbnailService";

@Controller("api")
export class UploadController {
  constructor(
    readonly fileService: FileService,
    readonly thumbnailService: ThumbnailService,
    readonly linkService: LinkService
  ) {}

  @Post("upload")
  @UseGuards(TokenAuthGuard)
  async uploadFile(@Req() request: FastifyRequest<{ Querystring: { input?: string } }>) {
    // todo: upload size limiting https://github.com/fastify/fastify-multipart/issues/196
    // todo: strip exif data from uploads
    const upload = await request.file();
    if (!upload) {
      // handle shortening urls
      if (!request.query.input) throw new BadRequestException("Could not determine upload type.");
      return this.createLink(request, request.query.input);
    }

    const data = await upload.toBuffer();
    const mappedType = await getTypeFromExtension(upload.filename, data);
    const type = mappedType || upload.mimetype;
    if (config.allowTypes?.includes(type) === false) {
      throw new BadRequestException(`"${type}" is not supported by this server.`);
    }

    const fileRepo = getRepository(File);
    const file = fileRepo.create({
      type: type,
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
      delete: `${config.host}/d/${file.deletionId}`,
    });
  }

  @Post("link")
  @UseGuards(TokenAuthGuard)
  async createLink(@Req() request: FastifyRequest, @Query("url") url?: string) {
    if (!url?.startsWith("http")) {
      throw new BadRequestException("Unknown or unsupported URL.");
    }

    const link = await this.linkService.createLink(url, request.user);
    return {
      direct: link.url,
      delete: `${config.host}/d/${link.deletionId}`,
    };
  }
}
