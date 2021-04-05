import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { File } from "@prisma/client";
import { FastifyRequest } from "fastify";
import { nanoid } from "nanoid";
import { Permission } from "../../constants";
import { JWTAuthGuard } from "../../guards/JWTAuthGuard";
import { prisma } from "../../prisma";
import { RequirePermissions, UserId } from "../auth/auth.decorators";
import { FileService } from "../file/file.service";
import { InviteService } from "../invite/invite.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private inviteService: InviteService,
    private fileService: FileService
  ) {}

  @Get("api/user")
  @UseGuards(JWTAuthGuard)
  async getUser(@UserId() userId: string) {
    return this.userService.get(userId);
  }

  @Post("/api/user")
  async createUser(@Body() data: CreateUserDto) {
    const invite = await this.inviteService.verifyToken(data.invite);
    return this.userService.create(data.username, data.password, invite);
  }

  @Delete("api/user/:id")
  @RequirePermissions(Permission.DELETE_USERS)
  @UseGuards(JWTAuthGuard)
  async deleteUser(@Param("id") userId: string) {
    return this.userService.delete(userId);
  }

  @Get("api/user/files")
  @UseGuards(JWTAuthGuard)
  async getUserFiles(@UserId() userId: string, @Param("cursor") cursor?: string) {
    const files = await this.userService.getFiles(userId, cursor);
    return files.map((file) =>
      Object.assign(file, {
        displayName: this.fileService.getDisplayName(file),
        urls: this.fileService.getUrls(file),
      })
    );
  }

  @Get("api/user/upload_token")
  @UseGuards(JWTAuthGuard)
  async getUserUploadToken(@Request() req: FastifyRequest) {
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      select: { token: true },
    });

    if (!user) throw new InternalServerErrorException("Expected user was missing");
    return { upload_token: user.token };
  }

  @Put("api/user/upload_token")
  @UseGuards(JWTAuthGuard)
  async resetUserUploadToken(@UserId() userId: string) {
    const token = nanoid(64);
    await prisma.user.update({
      where: { id: userId },
      data: { token },
    });

    return { upload_token: token };
  }
}
