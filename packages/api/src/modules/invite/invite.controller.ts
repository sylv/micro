import { Controller, Get, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { RequirePermissions, UserId } from "../auth/auth.decorators";
import { InviteService } from "./invite.service";
import { JWTAuthGuard } from "../auth/guards/jwt.guard";
import { Permission } from "../../constants";

@Controller()
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get("invite/:id")
  async getInvite(@Param("id") inviteId: string) {
    const invite = await this.inviteService.get(inviteId);
    if (!invite) throw new NotFoundException();
    return invite;
  }

  @Get("invite")
  @Post("invite")
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() userId: string) {
    return this.inviteService.create(userId, null);
  }
}
