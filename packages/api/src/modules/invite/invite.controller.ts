import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Permission } from '../../constants';
import { RequirePermissions, UserId } from '../auth/auth.decorators';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { InviteService } from './invite.service';

@Controller()
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Get('invite')
  @Post('invite')
  @RequirePermissions(Permission.CREATE_INVITE)
  @UseGuards(JWTAuthGuard)
  async createInvite(@UserId() userId: string) {
    return this.inviteService.create(userId, null);
  }
}
