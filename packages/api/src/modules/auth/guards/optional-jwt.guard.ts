import { ExecutionContext } from "@nestjs/common";
import { JWTAuthGuard } from "./jwt.guard";

export class OptionalJWTAuthGuard extends JWTAuthGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    return true;
  }
}
