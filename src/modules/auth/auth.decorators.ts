import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Permission } from "../../constants";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { PermissionGuard } from "../../guards/permission.guard";

export const RequirePermissions = (...permissions: Array<Permission>) => {
  const aggregate = permissions.reduce((acc, bit) => (acc |= bit), 0);
  return applyDecorators(SetMetadata("permissions", aggregate), UseGuards(JWTAuthGuard, PermissionGuard));
};

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  return request.user.id;
});
