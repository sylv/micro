import { BadRequestException, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { config } from "../config";
import { File } from "../entities/File";
import { TokenAuthGuard } from "../guards/TokenAuthGuard";
import { ThumbnailService } from "../services/ThumbnailService";
import { FileService } from "../services/FileService";

@Controller("upload")
export class UploadController {
  constructor(readonly fileService: FileService, readonly thumbnailService: ThumbnailService) {}

  @Post()
  @UseGuards(TokenAuthGuard)
  async uploadFile(@Req() request: FastifyRequest) {
    // todo: upload size limiting
    const uploadMeta = await request.file();
    if (!config.allow_types.includes(uploadMeta.mimetype)) {
      throw new BadRequestException(`"${uploadMeta.mimetype}" is not supported by this server.`);
    }

    const fileRepo = getRepository(File);
    const data = await uploadMeta.toBuffer();
    const file = fileRepo.create({
      type: uploadMeta.mimetype,
      name: uploadMeta.filename,
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
}
