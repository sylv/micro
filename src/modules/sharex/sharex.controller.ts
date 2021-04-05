import { BadRequestException, Controller, Headers, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import randomItem from "random-item";
import { config } from "../../config";
import { UploadAuthGuard } from "../../guards/UploadAuthGuard";
import { formatUrl } from "../../helpers/formatUrl";
import { ContentType, DeletionService } from "../deletion/deletion.service";
import { LinkService } from "../link/link.service";
import { FileService } from "../file/file.service";
import { UserId } from "../auth/auth.decorators";

@Controller()
export class ShareXController {
  constructor(
    private fileService: FileService,
    private linkService: LinkService,
    private deletionService: DeletionService
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
    const host = randomItem(hosts.split(/, ?/g));
    if (input?.startsWith("http")) {
      const link = await this.linkService.create(input, userId);
      const urls = this.linkService.getUrls(link);
      const deletion = await this.deletionService.create(ContentType.LINK, link.id);
      return {
        // "view" aliases to "direct" for compatibility
        view: formatUrl(host, urls.direct),
        direct: formatUrl(host, urls.direct),
        metadata: formatUrl(host, urls.metadata),
        delete: formatUrl(host, deletion.url),
      };
    }

    const upload = await request.file();
    if (!upload) throw new BadRequestException("Missing upload.");
    const file = await this.fileService.create(upload, request, userId);
    const deletion = await this.deletionService.create(ContentType.FILE, file.id);
    const urls = this.fileService.getUrls(file);
    return {
      metadata: formatUrl(host, urls.metadata)!,
      thumbnail: formatUrl(host, urls.thumbnail),
      direct: formatUrl(host, urls.direct),
      view: formatUrl(host, urls.view),
      delete: formatUrl(host, deletion.url),
    };
  }
}
