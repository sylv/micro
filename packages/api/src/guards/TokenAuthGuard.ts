import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

@Injectable()
export class TokenAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const token = req.headers.authorization;
    if (!token) return false;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ select: ["id"], where: { token } });
    if (!user) return false;
    req.user = user.id;
    return true;
  }
}
