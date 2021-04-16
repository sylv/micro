import { Controller, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { Permission } from "../../constants";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { RenderableReply } from "../../types";
import { RequirePermissions, UserId } from "../auth/auth.decorators";
import { InviteService } from "./invite.service";

@Controller()
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get("invite/:token")
  async getPage(@Res() reply: RenderableReply, @Param("token") token: string) {
    const payload = await this.get(token);
    return reply.render("invite/[inviteToken]", {
      inviteToken: token,
      invite: JSON.stringify(payload),
    });
  }

  @Get("api/invite/:token")
  async get(@Param("token") token: string) {
    return this.inviteService.verifyToken(token);
  }

  @Get("api/invite")
  @Post("api/invite")
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async create(@UserId() userId: string) {
    return this.inviteService.create(userId, undefined);
  }
}
