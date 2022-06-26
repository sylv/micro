import type { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JWTAuthGuard } from './jwt.guard';

export class OptionalJWTAuthGuard extends JWTAuthGuard {
  async canActivate(context: ExecutionContext) {
    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return true;
      }

      throw error;
    }
  }
}
