import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { Permission } from "../constants";
import { UserService } from "../modules/user/user.service";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private userService: UserService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<number | undefined>("permissions", context.getHandler());
    if (requiredPermissions === undefined) throw new Error("Missing permissions definition");
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (!request.user.id) return false;
    const userId = request.user.id;
    const user = await this.userService.getUser(userId);
    if (!user) return false;
    if (this.userService.checkPermissions(user.permissions, Permission.ADMINISTRATOR)) return true;
    if (!this.userService.checkPermissions(user.permissions, requiredPermissions)) return false;
    return true;
  }
}
