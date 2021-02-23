import { BadRequestException, Controller, Headers, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { config } from "../config";
import { UserId } from "../decorators/UserId";
import { ContentType } from "../entities/base/Content";
import { UploadAuthGuard } from "../guards/UploadAuthGuard";
import { getRandomElement } from "../helpers/getRandomElement";
import { DeletionService } from "../services/DeletionService";
import { FileService } from "../services/FileService";
import { LinkService } from "../services/LinkService";
import { formatUrl } from "../helpers/formatUrl";

@Controller()
export class ShareXController {
  constructor(
    protected fileService: FileService,
    protected linkService: LinkService,
    protected deletionService: DeletionService
  ) {}

  @Post("api/sharex")
  @UseGuards(UploadAuthGuard)
  async createShareXUpload(
    @Req() request: FastifyRequest,
    @UserId() userId: string,
    @Query("input") input?: string,
    @Headers("x-micro-host") hosts = config.host
  ) {
    // todo: it would be nice if we validated this and threw an error on invalid domains
    const host = getRandomElement(hosts.split(/, ?/g));
    if (input?.startsWith("http")) {
      const link = await this.linkService.createLink(input, userId);
      const deletionUrl = this.deletionService.getDeletionUrl(ContentType.LINK, link.id);
      return {
        direct: formatUrl(host, link.url.direct!),
        metadata: formatUrl(host, link.url.metadata)!,
        delete: formatUrl(host, deletionUrl),
      };
    }

    const upload = await request.file();
    if (!upload) throw new BadRequestException("Missing upload.");
    const file = await this.fileService.createFile(upload, request, userId);
    const deletionUrl = this.deletionService.getDeletionUrl(ContentType.FILE, file.id);
    return {
      metadata: formatUrl(host, file.urls.metadata)!,
      thumbnail: formatUrl(host, file.urls.thumbnail),
      direct: formatUrl(host, file.urls.direct),
      view: formatUrl(host, file.urls.view),
      delete: formatUrl(host, deletionUrl),
    };
  }
}
