import { applyDecorators, createParamDecorator, SetMetadata, UseGuards } from '@nestjs/common';
import type { Permission } from '../../constants';
import { getRequest } from '../../helpers/get-request';
import { JWTAuthGuard } from './guards/jwt.guard';
import { PermissionGuard } from './guards/permission.guard';

export const RequirePermissions = (...permissions: Permission[]) => {
  let aggregate = 0;
  for (const bit of permissions) aggregate |= bit;
  return applyDecorators(SetMetadata('permissions', aggregate), UseGuards(JWTAuthGuard, PermissionGuard));
};

export const UserId = createParamDecorator((_, context) => {
  const request = getRequest(context);
  return request.user?.id;
});

export const CurrentHost = createParamDecorator((_, context) => {
  return getRequest(context).host;
});
