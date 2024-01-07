import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { config, hosts, rootHost, type MicroHost } from '../config.js';
import type { ConfigHost } from '../types/config.type.js';
import { Config } from '../types/config.type.js';
import { CurrentHost, UserId } from './auth/auth.decorators.js';
import { OptionalJWTAuthGuard } from './auth/guards/optional-jwt.guard.js';
import { UserService } from './user/user.service.js';

@Resolver(() => Config)
export class AppResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => Config)
  @UseGuards(OptionalJWTAuthGuard)
  async config(@CurrentHost() currentHost: MicroHost, @UserId() userId?: string): Promise<Config> {
    let tags: string[] = [];
    if (userId) {
      const user = await this.userService.getUser(userId, false);
      if (user) {
        tags = user.tags;
      }
    }

    return {
      inquiriesEmail: config.inquiries,
      uploadLimit: config.uploadLimit,
      allowTypes: config.allowTypes ? [...config.allowTypes?.values()] : [],
      requireEmails: !!config.email,
      rootHost: this.filterHost(rootHost),
      currentHost: this.filterHost(currentHost),
      hosts: hosts
        .filter((host) => {
          if (!host.tags || !host.tags[0]) return true;
          return host.tags.every((tag) => tags.includes(tag));
        })
        .map((host) => ({
          url: host.url,
          normalised: host.normalised,
          redirect: host.redirect,
        })),
    } as const;
  }

  private filterHost(host: MicroHost): ConfigHost {
    return {
      url: host.url,
      normalised: host.normalised,
      redirect: host.redirect,
    };
  }
}
