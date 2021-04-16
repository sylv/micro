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
export class ShareXController {
  constructor(
    private fileService: FileService,
    private linkService: LinkService,
    private deletionService: DeletionService,
    private hostService: HostsService,
    private userService: UserService
  ) {}

  @Post("api/sharex")
  @UseGuards(JWTAuthGuard)
  async createShareXUpload(
    @Req() request: FastifyRequest,
    @UserId() userId: string,
    @Query("input") input?: string,
    @Headers("x-micro-host") hosts = config.hosts[0].url
  ) {
    const user = await this.userService.get(userId);
    const host = await this.hostService.resolve(hosts, user.tags);
    if (input?.startsWith("http")) {
      const link = await this.linkService.create(input, userId);
      const urls = this.linkService.getUrls(link);
      const deletion = await this.deletionService.create(ContentType.LINK, link.id);
      return {
        // "view" aliases to "direct" for compatibility with the image uploader
        view: this.hostService.format(host.url, user.username, urls.direct),
        direct: this.hostService.format(host.url, user.username, urls.direct),
        metadata: this.hostService.format(host.url, user.username, urls.metadata),
        delete: this.hostService.format(host.url, user.username, deletion.url),
      };
    }

    const upload = await request.file();
    if (!upload) throw new BadRequestException("Missing upload.");
    const file = await this.fileService.create(upload, request, user);
    const deletion = await this.deletionService.create(ContentType.FILE, file.id);
    const urls = this.fileService.getUrls(file);
    return {
      metadata: this.hostService.format(host.url, user.username, urls.metadata),
      thumbnail: this.hostService.format(host.url, user.username, urls.thumbnail),
      direct: this.hostService.format(host.url, user.username, urls.direct),
      view: this.hostService.format(host.url, user.username, urls.view),
      delete: this.hostService.format(host.url, user.username, deletion.url),
    };
  }
}
