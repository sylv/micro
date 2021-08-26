import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Permission } from "../../constants";
import { JWTAuthGuard } from "../../guards/jwt.guard";
import { PermissionGuard } from "../../guards/permission.guard";

export const RequirePermissions = (...permissions: Permission[]) => {
  let aggregate = 0;
  for (const bit of permissions) aggregate |= bit;
  return applyDecorators(SetMetadata("permissions", aggregate), UseGuards(JWTAuthGuard, PermissionGuard));
};

export const UserId = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>();
  return request.user.id;
});
