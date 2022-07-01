import { Controller, Get, Param, Response } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user/:userId/verify/:verifyId')
  async verifyUser(
    @Param('userId') userId: string,
    @Param('verifyId') verifyId: string,
    @Response() reply: FastifyReply
  ) {
    await this.userService.verifyUser(userId, verifyId);
    return reply.redirect(302, '/login?verified=true');
  }
}
