import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import { Permission } from '../../../constants';
import { UserService } from '../../user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly userService: UserService, private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<number | undefined>('permissions', context.getHandler());
    if (requiredPermissions === undefined) throw new Error('Missing permissions definition');
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (!request.user.id) return false;
    const userId = request.user.id;
    const user = await this.userService.getUser(userId, false);
    if (!user) return false;
    if (this.userService.checkPermissions(user.permissions, Permission.ADMINISTRATOR)) return true;
    if (!this.userService.checkPermissions(user.permissions, requiredPermissions)) return false;
    return true;
  }
}
