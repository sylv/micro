import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { hosts } from '../../config.js';
import { getRequest } from '../../helpers/get-request.js';

@Injectable()
export class HostGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = getRequest(context);
    const referer = request.headers.referer;
    if (!referer) {
      request.host = hosts[0];
      return true;
    }

    const host = hosts.find((host) => host.pattern.test(referer));
    if (!host) throw new BadRequestException('Invalid host.');
    request.host = host;
    return true;
  }
}
