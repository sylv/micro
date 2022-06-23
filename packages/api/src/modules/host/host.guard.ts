import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { config } from '../../config';

@Injectable()
export class HostGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const referer = request.headers.referer;
    if (!referer) {
      request.host = config.hosts[0];
      return true;
    }

    const host = config.hosts.find((host) => host.pattern.test(referer));
    if (!host) throw new BadRequestException('Invalid host.');
    request.host = host;
    return true;
  }
}
