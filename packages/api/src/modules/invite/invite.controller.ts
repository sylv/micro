import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { Permission } from "../../constants.js";
import { RequirePermissions, UserId } from "../auth/auth.decorators.js";
import { JWTAuthGuard } from "../auth/guards/jwt.guard.js";
import { InviteService } from "./invite.service.js";

@Controller()
export class InviteController {
  constructor(private inviteService: InviteService) {}

  @Get("invite")
  @Post("invite")
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() userId: string) {
    return this.inviteService.create(userId, null);
  }
}
