import { BadRequestException, Controller, Headers, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { config } from "../../config";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { UserId } from "../auth/auth.decorators";
import { ContentType, DeletionService } from "../deletion/deletion.service";
import { FileService } from "../file/file.service";
import { HostsService } from "../hosts/hosts.service";
import { LinkService } from "../link/link.service";
import { UserService } from "../user/user.service";

@Controller()
export class UploadController {
  constructor(
    private fileService: FileService,
    private linkService: LinkService,
    private deletionService: DeletionService,
    private hostsService: HostsService,
    private userService: UserService
  ) {}

  @Post(["api/upload", "api/sharex"])
  @UseGuards(JWTAuthGuard)
  async createUpload(
    @Req() request: FastifyRequest,
    @UserId() userId: string,
    @Query("input") input?: string,
    @Headers("x-micro-host") hosts = config.rootHost.url
  ) {
    const user = await this.userService.getUser(userId);
    const host = await this.hostsService.resolveHost(hosts, user.tags, true);
    // todo: this is a shitty way to detect urls
    if (input?.startsWith("http")) {
      const link = await this.linkService.createLink(input, userId);
      const urls = this.linkService.getLinkUrls(link);
      const deletion = await this.deletionService.createToken(ContentType.LINK, link.id);
      return {
        // "view" aliases to "direct" for compatibility with the image uploader
        id: link.id,
        host: link.host,
        links: {
          view: this.hostsService.formatHostUrl(host.url, user.username, urls.direct),
          direct: this.hostsService.formatHostUrl(host.url, user.username, urls.direct),
          metadata: this.hostsService.formatHostUrl(host.url, user.username, urls.metadata),
          delete: this.hostsService.formatHostUrl(host.url, user.username, deletion.url),
        },
      };
    }

    const upload = await request.file();
    if (!upload) throw new BadRequestException("Missing upload.");
    const file = await this.fileService.createFile(upload, request, user, host);
    const deletion = await this.deletionService.createToken(ContentType.FILE, file.id);
    const urls = this.fileService.getFileUrls(file);
    return {
      id: file.id,
      host: file.host,
      links: {
        metadata: this.hostsService.formatHostUrl(host.url, user.username, urls.metadata),
        thumbnail: this.hostsService.formatHostUrl(host.url, user.username, urls.thumbnail),
        direct: this.hostsService.formatHostUrl(host.url, user.username, urls.direct),
        view: this.hostsService.formatHostUrl(host.url, user.username, urls.view),
        delete: this.hostsService.formatHostUrl(host.url, user.username, deletion.url),
      },
    };
  }
}
