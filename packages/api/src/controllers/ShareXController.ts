import { Post, Query, UseGuards, BadRequestException, Req, Controller } from "@nestjs/common";
import { UploadAuthGuard } from "../guards/UploadAuthGuard";
import { FastifyRequest } from "fastify";
import { UserId } from "../decorators/UserId";
import { FileService } from "../services/FileService";
import { DeletionService } from "../services/DeletionService";
import { LinkService } from "../services/LinkService";
import { ContentType } from "../entities/Content";

@Controller()
export class ShareXController {
  constructor(
    protected fileService: FileService,
    protected linkService: LinkService,
    protected deletionService: DeletionService
  ) {}

  @Post("api/sharex")
  @UseGuards(UploadAuthGuard)
  async createShareXUpload(@Req() request: FastifyRequest, @UserId() userId: string, @Query("input") input?: string) {
    if (input?.startsWith("http")) {
      const link = await this.linkService.createLink(input, userId);
      const deletionUrl = this.deletionService.getDeletionUrl(ContentType.LINK, link.id);
      return {
        direct: link.url,
        delete: deletionUrl,
      };
    }

    const upload = await request.file();
    if (!upload) throw new BadRequestException("Missing upload.");
    const data = await upload.toBuffer();
    const file = await this.fileService.createFile(data, upload.filename, upload.mimetype, userId);
    const deletionUrl = this.deletionService.getDeletionUrl(ContentType.FILE, file.id);
    return Object.assign(file.url, {
      delete: deletionUrl,
    });
  }
}
