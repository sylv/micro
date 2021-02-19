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
import { IsString, MaxLength, MinLength } from "class-validator";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { RequirePermissions } from "../decorators/RequirePermissions";
import { UserId } from "../decorators/UserId";
import { File } from "../entities/File";
import { User } from "../entities/User";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { generateId } from "../helpers/generateId";
import { InviteService } from "../services/InviteService";
import { UserService } from "../services/UserService";
import { Permission } from "../types";

export class CreateUserDto {
  @MaxLength(20)
  @MinLength(2)
  @IsString()
  username!: string;

  @MaxLength(100)
  @MinLength(10)
  @IsString()
  password!: string;

  @IsString()
  invite!: string;
}

@Controller()
export class UserController {
  constructor(protected userService: UserService, protected inviteService: InviteService) {}

  @Get("api/user")
  @UseGuards(JWTAuthGuard)
  async getUser(@UserId() userId: string) {
    return this.userService.getUser(userId);
  }

  @Post("/api/user")
  async createUser(@Body() data: CreateUserDto) {
    const invite = await this.inviteService.getInvite(data.invite);
    return this.userService.createUser(data.username, data.password, invite);
  }

  @Delete("api/user/:id")
  @RequirePermissions(Permission.DELETE_USERS)
  @UseGuards(JWTAuthGuard)
  async deleteUser(@Param("id") userId: string) {
    return this.userService.deleteUser(userId);
  }

  @Get("api/user/files")
  @UseGuards(JWTAuthGuard)
  async getUserFiles(@UserId() userId: string, @Param("skip") skip?: number): Promise<File[]> {
    return this.userService.getUserFiles(userId, skip ?? 0);
  }

  @Get("api/user/upload_token")
  @UseGuards(JWTAuthGuard)
  async getUserUploadToken(@Request() req: FastifyRequest) {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne(req.user, { select: ["token"] });
    if (!user) throw new InternalServerErrorException("Expected user was missing");
    return { upload_token: user.token };
  }

  @Put("api/user/upload_token")
  @UseGuards(JWTAuthGuard)
  async resetUserUploadToken(@UserId() userId: string) {
    const token = generateId(64);
    const userRepo = getRepository(User);
    await userRepo.update(userId, { token });
    return { upload_token: token };
  }
}
