import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { UserService } from "../services/UserService";

@Injectable()
export class PermissionGuard {
  constructor(private userService: UserService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<number>("permissions", context.getHandler());
    if (requiredPermissions === undefined) throw new Error("Missing permissions definition");
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (!request.user.id) return false;
    const userId = request.user.id;
    const user = await this.userService.getUser(userId);
    if (!user?.checkPermissions(requiredPermissions)) return false;
    return true;
  }
}
