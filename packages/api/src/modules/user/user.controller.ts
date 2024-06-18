import { Controller, Get, Param, Response } from "@nestjs/common";
import { type FastifyReply } from "fastify";
import { UserService } from "./user.service.js";
import { rootHost } from "../../config.js";

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get("user/:userId/verify/:verifyId")
  async verifyUser(
    @Param("userId") userId: string,
    @Param("verifyId") verifyId: string,
    @Response() reply: FastifyReply,
  ) {
    await this.userService.verifyUser(userId, verifyId);
    return reply.redirect(302, rootHost.url + "/login?verified=true");
  }
}
