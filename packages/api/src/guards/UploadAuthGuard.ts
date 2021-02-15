import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

@Injectable()
export class UploadAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest<{ Querystring: { key?: string } }>>();
    const token = req.headers.authorization || req.query?.key;
    if (!token) return false;
    const userRepo = getRepository(User);
    const user = await userRepo.findOne({ select: ["id"], where: { token } });
    if (!user) return false;
    req.user = user;
    return true;
  }
}
