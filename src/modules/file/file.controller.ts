import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { MultipartFile } from "fastify-multipart";
import { config } from "../../config";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { isImageScraper } from "../../helpers/is-image-scraper.helper";
import { RenderableReply } from "../../types";
import { UserId } from "../auth/auth.decorators";
import { ContentType, DeletionService } from "../deletion/deletion.service";
import { HostsService } from "../hosts/hosts.service";
import { UserService } from "../user/user.service";
import { FileService } from "./file.service";

@Controller()
export class FileController {
  constructor(
    private fileService: FileService,
    private deletionService: DeletionService,
    private userService: UserService,
    private hostsService: HostsService
  ) {}

  @Get(["file/:key", "f/:key"])
  async getFilePage(@Res() reply: RenderableReply, @Req() request: FastifyRequest, @Param("key") key: string) {
    const clean = this.fileService.cleanFileKey(key);
    const file = await this.getFile(clean.id, request);
    if (!this.hostsService.checkHostCanSendFile(file, request.host)) {
      throw new NotFoundException("Your file is in another castle.");
    }

    const scraper = isImageScraper(request.headers["user-agent"]);
    const directOverride = scraper && (!scraper.types || scraper.types.includes(file.type));
    if (clean.ext || directOverride) {
      return this.fileService.sendFile(clean.id, request, reply);
    }

    return reply.render("file/[fileId]", {
      fileId: clean.id,
      file: JSON.stringify(file),
    });
  }

  @Get("api/file/:id")
  async getFile(@Param("id") id: string, @Request() request: FastifyRequest) {
    return this.fileService.getFile(id, request.host);
  }

  @Delete("api/file/:id")
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param("id") id: string, @UserId() userId: string) {
    await this.fileService.deleteFile(id, userId);
    return { deleted: true };
  }

  @Post("api/file")
  @UseGuards(JWTAuthGuard)
  async createFile(@UserId() userId: string, @Req() request: FastifyRequest, @Headers("x-micro-host") hosts = config.rootHost.url) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException("Unknown user.");
    // todo: invalid type or maybe not because im a dumbass and forgot to leave a comment.
    // also an issue in upload.controller.ts, see there for more info with this same issue.
    const upload = (await request.file()) as MultipartFile | undefined;
    if (!upload) throw new BadRequestException("Missing upload.");
    const host = await this.hostsService.resolveHost(hosts, user.tags, true);
    const file = await this.fileService.createFile(upload, request, user, host);
    const deletionUrl = this.deletionService.createToken(ContentType.FILE, file.id);
    return Object.assign(this.fileService.getFileUrls(file), {
      delete: deletionUrl,
    });
  }
}
