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
import { classToPlain } from "class-transformer";
import { FastifyReply, FastifyRequest } from "fastify";
import { MultipartFile } from "fastify-multipart";
import mime from "mime-types";
import { config } from "../../config";
import { isImageScraper } from "../../helpers/is-image-scraper.helper";
import { UserId } from "../auth/auth.decorators";
import { JWTAuthGuard } from "../auth/guards/jwt.guard";
import { HostsService } from "../hosts/hosts.service";
import { UserService } from "../user/user.service";
import { FileService } from "./file.service";

@Controller()
export class FileController {
  constructor(private fileService: FileService, private userService: UserService, private hostsService: HostsService) {}

  @Get("file/:key")
  async getFile(@Res() reply: FastifyReply, @Param("key") key: string, @Request() request: FastifyRequest) {
    const clean = this.fileService.cleanFileKey(key);
    const file = await this.fileService.getFile(clean.id, request.host);
    if (!file) throw new NotFoundException("File not found.");
    if (!this.hostsService.checkHostCanSendFile(file, request.host)) {
      throw new ForbiddenException("That file is not available on this host.");
    }

    if (clean.ext) {
      const mimeType = mime.lookup(clean.ext);
      if (!mimeType) throw new BadRequestException("Unknown file extension.");
      if (file.type !== mimeType) {
        throw new BadRequestException("File extension does not match file type.");
      }
    }

    const scraper = isImageScraper(request.headers["user-agent"]);
    const isDirect = (scraper && (!scraper.types || scraper.types.includes(file.type))) || !!clean.ext;
    if (isDirect) {
      return this.fileService.sendFile(clean.id, request, reply);
    }

    return reply.send(classToPlain(file));
  }

  @Delete("file/:id")
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param("id") id: string, @UserId() userId: string) {
    await this.fileService.deleteFile(id, userId);
    return { deleted: true };
  }

  @Post("file")
  @UseGuards(JWTAuthGuard)
  async createFile(@UserId() userId: string, @Req() request: FastifyRequest, @Headers("x-micro-host") hosts = config.rootHost.url) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException("Unknown user.");
    const upload = (await request.file()) as MultipartFile | undefined;
    if (!upload) throw new BadRequestException("Missing upload.");
    const host = await this.hostsService.resolveHost(hosts, user.tags, true);
    const file = await this.fileService.createFile(upload, request, user, host);
    return file;
  }
}
