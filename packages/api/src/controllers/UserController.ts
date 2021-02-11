import { Controller, Get, InternalServerErrorException, Param, Req, Request, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File } from "../entities/File";
import { User } from "../entities/User";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { generateId } from "../helpers/generateId";
import { Await } from "../types";
import { TokenResponse } from "./AuthController";

export type UserResponse = Await<ReturnType<UserController["user"]>>;
export type UserFilesResponse = Await<ReturnType<UserController["userFiles"]>>;

@Controller("api/user")
export class UserController {
  @UseGuards(JWTAuthGuard)
  @Get()
  async user(@Request() req: FastifyRequest) {
    const userRepo = getRepository(User);
    return await userRepo.findOne(req.user);
  }

  @UseGuards(JWTAuthGuard)
  @Get("files")
  async userFiles(@Request() req: FastifyRequest, @Param("skip") skip?: number): Promise<File[]> {
    const fileRepo = getRepository(File);
    return await fileRepo.find({
      take: 24,
      skip: skip,
      order: { createdAt: -1 },
      where: {
        owner: req.user,
      },
    });
  }

  @UseGuards(JWTAuthGuard)
  @Get("token")
  async userToken(@Request() req: FastifyRequest): Promise<TokenResponse> {
    const userRepo = getRepository(User);
    const user = await userRepo.findOne(req.user, { select: ["token"] });
    if (!user) throw new InternalServerErrorException();
    return { access_token: user.token };
  }

  @UseGuards(JWTAuthGuard)
  @Get("token/reset")
  async userTokenReset(@Req() request: FastifyRequest): Promise<TokenResponse> {
    const token = generateId(64);
    const userRepo = getRepository(User);
    await userRepo.update(request.user, { token });
    return { access_token: token };
  }
}
