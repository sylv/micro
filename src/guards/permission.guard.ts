import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { Permission } from "../constants";
import { UserService } from "../modules/user/user.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private userService: UserService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<number>("permissions", context.getHandler());
    if (requiredPermissions === undefined) throw new Error("Missing permissions definition");
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (!request.user.id) return false;
    const userId = request.user.id;
    const user = await this.userService.get(userId);
    if (!user) throw new ForbiddenException();
    if (this.userService.checkPermissions(user.permissions, Permission.ADMINISTRATOR)) return true;
    if (!this.userService.checkPermissions(user.permissions, requiredPermissions)) return false;
    return true;
  }
}
