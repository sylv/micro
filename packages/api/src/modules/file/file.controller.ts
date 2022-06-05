import { MultipartFile } from "@fastify/multipart";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadRequestException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { config } from "../../config";
import { randomItem } from "../../helpers/random-item.helper";
import { UserId } from "../auth/auth.decorators";
import { JWTAuthGuard } from "../auth/guards/jwt.guard";
import { HostService } from "../host/host.service";
import { Paste } from "../paste/paste.entity";
import { UserService } from "../user/user.service";
import { FileService } from "./file.service";

@Controller()
export class FileController {
  constructor(
    @InjectRepository(Paste) private pasteRepo: EntityRepository<Paste>,
    private fileService: FileService,
    private userService: UserService,
    private hostService: HostService
  ) {}

  @Get("file/:fileId/content")
  async getFileContent(
    @Res() reply: FastifyReply,
    @Param("fileId") fileId: string,
    @Request() request: FastifyRequest
  ) {
    return this.fileService.sendFile(fileId, request, reply);
  }

  @Get("file/:fileId")
  async getFile(@Res() reply: FastifyReply, @Param("fileId") fileId: string, @Request() request: FastifyRequest) {
    const file = await this.fileService.getFile(fileId, request.host);
    return reply.send(file);
  }

  @Delete("file/:id")
  @UseGuards(JWTAuthGuard)
  async deleteFile(@Param("id") id: string, @UserId() userId: string) {
    await this.fileService.deleteFile(id, userId);
    return { deleted: true };
  }

  @Post("file")
  @UseGuards(JWTAuthGuard)
  async createFile(
    @UserId() userId: string,
    @Req() request: FastifyRequest,
    @Headers("x-micro-host") hosts = config.rootHost.url,
    @Headers("X-Micro-Paste-Shortcut") shortcut: string
  ) {
    const user = await this.userService.getUser(userId);
    if (!user) throw new ForbiddenException("Unknown user.");
    const upload = (await request.file()) as MultipartFile | undefined;
    if (!upload) throw new BadRequestException("Missing upload.");
    if (shortcut === "true" && upload.mimetype === "text/plain") {
      const content = await upload.toBuffer();
      const paste = this.pasteRepo.create({
        content: content.toString(),
        burn: false,
        encrypted: false,
        owner: userId,
        extension: "txt",
      });

      await this.pasteRepo.persistAndFlush(paste);
      return paste;
    }

    const possibleHosts = hosts.split(/, ?/g);
    const hostUrl = randomItem(possibleHosts);
    const host = await this.hostService.getHostFrom(hostUrl, user.tags);
    const file = await this.fileService.createFile(upload, request, user, host);
    return file;
  }
}
