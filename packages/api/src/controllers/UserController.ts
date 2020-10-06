import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { File, FileCategory } from "../entities/File";
import { User } from "../entities/User";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { Await } from "../types";

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
      take: 25,
      skip: skip,
      where: {
        category: FileCategory.IMAGE,
        owner: req.user,
      },
    });
  }
}
