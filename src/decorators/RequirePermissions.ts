import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { PermissionGuard } from "../guards/PermissionGuard";
import { JWTAuthGuard } from "../guards/JWTAuthGuard";
import { Permission } from "../constants";

export function RequirePermissions(...permissions: Array<Permission>) {
  const aggregate = permissions.reduce((acc, bit) => (acc |= bit), 0);
  return applyDecorators(SetMetadata("permissions", aggregate), UseGuards(JWTAuthGuard, PermissionGuard));
}
