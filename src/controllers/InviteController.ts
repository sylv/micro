import { Controller, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../decorators/RequirePermissions";
import { UserId } from "../decorators/UserId";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { InviteService } from "../services/InviteService";
import { Permission, RenderableReply } from "../types";

@Controller()
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get("invite/:token")
  async getInvitePage(@Res() reply: RenderableReply, @Param("token") token: string) {
    const payload = await this.inviteService.verifyInviteToken(token);
    return reply.render("invite/[inviteToken]", {
      inviteToken: token,
      invite: JSON.stringify(payload),
    });
  }

  @Get("api/invite/:token")
  async getInvite(@Param("token") token: string) {
    return this.inviteService.verifyInviteToken(token);
  }

  @Get("api/invite")
  @Post("api/invite")
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() userId: string) {
    const token = this.inviteService.signInviteToken(userId);
    const url = this.inviteService.getInviteUrl(token);
    return { token, url };
  }
}
