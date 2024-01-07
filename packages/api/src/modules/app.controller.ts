import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { config, hosts, rootHost } from '../config.js';
import { UserId } from './auth/auth.decorators.js';
import { OptionalJWTAuthGuard } from './auth/guards/optional-jwt.guard.js';
import { UserService } from './user/user.service.js';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get('config')
  @UseGuards(OptionalJWTAuthGuard)
  async getConfig(@Req() request: FastifyRequest, @UserId() userId?: string) {
    let tags: string[] = [];
    if (userId) {
      const user = await this.userService.getUser(userId, false);
      if (user) {
        tags = user.tags;
      }
    }

    return {
      inquiries: config.inquiries,
      uploadLimit: config.uploadLimit,
      allowTypes: config.allowTypes ? [...config.allowTypes?.values()] : undefined,
      email: !!config.email,
      rootHost: {
        url: rootHost.url,
        normalised: rootHost.normalised,
      },
      hosts: hosts
        .filter((host) => {
          if (!host.tags || !host.tags[0]) return true;
          return host.tags.every((tag) => tags.includes(tag));
        })
        .map((host) => ({
          url: host.url,
          normalised: host.normalised,
        })),
      host: {
        url: request.host.url,
        normalised: request.host.normalised,
        tags: request.host.tags,
        redirect: request.host.redirect,
      },
    } as const;
  }
}
