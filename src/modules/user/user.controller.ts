import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { nanoid } from "nanoid";
import { Permission } from "../../constants";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { prisma } from "../../prisma";
import { JWTPayloadUser } from "../../strategies/jwt.strategy";
import { RequirePermissions, UserId } from "../auth/auth.decorators";
import { AuthService, TokenType } from "../auth/auth.service";
import { FileService } from "../file/file.service";
import { InviteService } from "../invite/invite.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private inviteService: InviteService,
    private fileService: FileService,
    private authService: AuthService
  ) {}

  @Get("api/user")
  @UseGuards(JWTAuthGuard)
  async get(@UserId() userId: string) {
    return this.userService.get(userId);
  }

  @Post("/api/user")
  async create(@Body() data: CreateUserDto) {
    const invite = await this.inviteService.verifyToken(data.invite);
    return this.userService.create(data.username, data.password, invite);
  }

  @Get("api/user/files")
  @UseGuards(JWTAuthGuard)
  async getFiles(@UserId() userId: string, @Param("cursor") cursor?: string) {
    const files = await this.userService.getFiles(userId, cursor);
    return files.map((file) =>
      Object.assign(file, {
        displayName: this.fileService.getDisplayName(file),
        urls: this.fileService.getUrls(file),
      })
    );
  }

  @Get("api/user/token")
  @UseGuards(JWTAuthGuard)
  async getToken(@UserId() userId: string) {
    const user = await this.userService.get(userId);
    const token = await this.authService.signToken<JWTPayloadUser>(TokenType.USER, {
      name: user.username,
      secret: user.secret,
      id: user.id,
    });

    return { token };
  }

  @Put("api/user/token")
  @UseGuards(JWTAuthGuard)
  async resetToken(@UserId() userId: string) {
    const secret = nanoid();
    await prisma.user.update({ where: { id: userId }, data: { secret } });
    return this.getToken(userId);
  }

  // temporary until admin UI
  @Get("api/user/:id/delete")
  @RequirePermissions(Permission.DELETE_USERS)
  @UseGuards(JWTAuthGuard)
  async delete(@Param("id") targetId: string) {
    const target = await this.userService.get(targetId);
    if (this.userService.checkPermissions(target.permissions, Permission.ADMINISTRATOR)) {
      throw new ForbiddenException("You can't do that to that user.");
    }

    await this.userService.delete(targetId);
    return { deleted: true };
  }

  // temporary until admin UI
  @Get("api/user/:id/tags/add/:tag")
  @RequirePermissions(Permission.ADD_USER_TAGS)
  @UseGuards(JWTAuthGuard)
  async addTagToUser(@Param("id") targetId: string, @Param("tag") tag: string) {
    const target = await this.userService.get(targetId);
    if (target.tags.includes(tag.toLowerCase())) {
      throw new BadRequestException("User already has that tag.");
    }

    await prisma.user.update({
      where: { id: target.id },
      data: {
        tags: target.tags.concat(tag.toLowerCase()),
      },
    });

    return { added: true, tag };
  }

  // temporary until admin UI
  @Get("api/user/:id/tags/remove/:tag")
  @RequirePermissions(Permission.ADD_USER_TAGS)
  @UseGuards(JWTAuthGuard)
  async removeTagFromUser(@Param("id") targetId: string, @Param("tag") tag: string) {
    const target = await this.userService.get(targetId);
    if (!target.tags.includes(tag)) {
      throw new BadRequestException("User does not have that tag.");
    }

    await prisma.user.update({
      where: { id: target.id },
      data: {
        tags: target.tags.filter((existing) => existing !== tag),
      },
    });

    return { removed: true, tag };
  }
}
