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
  async getUser(@UserId() userId: string) {
    return this.userService.getUser(userId);
  }

  @Post("/api/user")
  async createUser(@Body() data: CreateUserDto) {
    const invite = await this.inviteService.verifyToken(data.invite);
    return this.userService.createUser(data, invite);
  }

  @Get("api/user/files")
  @UseGuards(JWTAuthGuard)
  async getUserFiles(@UserId() userId: string, @Param("cursor") cursor?: string) {
    const files = await this.userService.getUserFiles(userId, cursor);
    return files.map((file) =>
      Object.assign(file, {
        displayName: this.fileService.getFileDisplayName(file),
        urls: this.fileService.getFileUrls(file),
      })
    );
  }

  @Get("api/user/token")
  @UseGuards(JWTAuthGuard)
  async getUserToken(@UserId() userId: string) {
    const user = await this.userService.getUser(userId, true);
    const token = await this.authService.signToken<JWTPayloadUser>(TokenType.USER, {
      name: user.username,
      secret: user.secret,
      id: user.id,
    });

    return { token };
  }

  @Put("api/user/token")
  @UseGuards(JWTAuthGuard)
  async resetUserToken(@UserId() userId: string) {
    const secret = nanoid();
    await prisma.user.update({ where: { id: userId }, data: { secret } });
    return this.getUserToken(userId);
  }

  // temporary until admin UI
  @Get("api/user/:id/delete")
  @RequirePermissions(Permission.DELETE_USERS)
  @UseGuards(JWTAuthGuard)
  async deleteUser(@Param("id") targetId: string) {
    const target = await this.userService.getUser(targetId);
    if (this.userService.checkPermissions(target.permissions, Permission.ADMINISTRATOR)) {
      throw new ForbiddenException("You can't do that to that user.");
    }

    await this.userService.deleteUser(targetId);
    return { deleted: true };
  }

  // temporary until admin UI
  @Get("api/user/:id/tags/add/:tag")
  @RequirePermissions(Permission.ADD_USER_TAGS)
  @UseGuards(JWTAuthGuard)
  async addTagToUser(@Param("id") targetId: string, @Param("tag") tag: string) {
    const target = await this.userService.getUser(targetId);
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
    const target = await this.userService.getUser(targetId);
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
