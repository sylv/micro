import { Controller, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { RequirePermissions } from "../decorators/RequirePermissions";
import { UserId } from "../decorators/UserId";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { InviteService } from "../services/InviteService";
import { Permission, RenderableReply } from "../types";

@Controller()
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get("invite/:id")
  async getInvitePage(@Res() reply: RenderableReply, @Param("id") id: string) {
    const invite = await this.inviteService.getInvite(id);
    return reply.render("invite/[inviteId]", {
      inviteId: invite.id,
      invite: JSON.stringify(classToPlain(invite)),
    });
  }

  @Get("api/invite/:id")
  async getInvite(@Param("id") id: string) {
    return this.inviteService.getInvite(id);
  }

  @Post("api/invite")
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() userId: string) {
    return this.inviteService.createInvite(userId);
  }
}
