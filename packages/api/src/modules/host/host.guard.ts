import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { config } from '../../config';
import { getRequest } from '../../helpers/get-request';

@Injectable()
export class HostGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = getRequest(context);
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
