import { Controller, Get, Param, Req, Request, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File, FileCategory } from "../entities/File";
import { User } from "../entities/User";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { generateToken } from "../helpers/generateToken";
import { Await } from "../types";
import { TokenResponse } from "./AuthController";

export type UserResponse = Await<ReturnType<UserController["user"]>>;
export type UserFilesResponse = Await<ReturnType<UserController["userFiles"]>>;

@Controller("user")
export class UserController {
  @UseGuards(JWTAuthGuard)
  @Get()
  async user(@Request() req: FastifyRequest) {
    const userRepo = getRepository(User);
    return await userRepo.findOne({ id: req.user });
  }

  @UseGuards(JWTAuthGuard)
  @Get("files")
  async userFiles(@Request() req: FastifyRequest, @Param("skip") skip?: number): Promise<File[]> {
    const fileRepo = getRepository(File);
    return await fileRepo.find({
      take: 24,
      skip: skip,
      order: { created_at: -1 },
      where: {
        category: FileCategory.IMAGE,
        owner: req.user,
      },
    });
  }

  @UseGuards(JWTAuthGuard)
  @Get("/token/reset")
  async userTokenReset(@Req() request: FastifyRequest): Promise<TokenResponse> {
    const token = generateToken(64);
    const userRepo = getRepository(User);
    await userRepo.update({ id: request.user }, { token });
    return { access_token: token };
  }
}
