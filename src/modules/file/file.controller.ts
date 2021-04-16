import { BadRequestException, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { isImageScraper } from "../../helpers/isImageScraper";
import { RenderableReply } from "../../types";
import { UserId } from "../auth/auth.decorators";
import { ContentType, DeletionService } from "../deletion/deletion.service";
import { UserService } from "../user/user.service";
import { FileService } from "./file.service";

@Controller()
export class FileController {
  constructor(
    private fileService: FileService,
    private deletionService: DeletionService,
    private userService: UserService
  ) {}

  @Get(["file/:key", "f/:key"])
  async getPage(@Res() reply: RenderableReply, @Req() request: FastifyRequest, @Param("key") key: string) {
    const clean = this.fileService.cleanKey(key);
    if (clean.ext) {
      return this.fileService.send(clean.id, request, reply);
    }

    // discord wont embed unless we return an image, so we have to detect their user-agents and
    // return it specifically for them. this might break if they update their second scraper ua
    const scraper = isImageScraper(request.headers["user-agent"]);
    const file = await this.get(clean.id);
    if (scraper && (!scraper.types || scraper.types.includes(file.type))) {
      return this.fileService.send(file.id, request, reply);
    }

    return reply.render("file/[fileId]", {
      fileId: clean.id,
      file: JSON.stringify(file),
    });
  }

  @Get("api/file/:id")
  async get(@Param("id") id: string) {
    return this.fileService.get(id);
  }

  @Delete("api/file/:id")
  @UseGuards(JWTAuthGuard)
  async delete(@Param("id") id: string, @UserId() userId: string) {
    await this.fileService.delete(id, userId);
    return { deleted: true };
  }

  @Post("api/file")
  @UseGuards(JWTAuthGuard)
  async create(@UserId() userId: string, @Req() request: FastifyRequest) {
    const upload = await request.file();
    const user = await this.userService.get(userId);
    if (!upload) throw new BadRequestException("Missing upload.");
    const file = await this.fileService.create(upload, request, user);
    const deletionUrl = this.deletionService.create(ContentType.FILE, file.id);
    return Object.assign(this.fileService.getUrls(file), {
      delete: deletionUrl,
    });
  }
}
