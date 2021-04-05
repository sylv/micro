import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { prisma } from "../prisma";

@Injectable()
export class UploadAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<FastifyRequest<{ Querystring: { key?: string } }>>();
    const token = req.headers.authorization || req.query?.key;
    if (!token) return false;
    const user = await prisma.user.findFirst({ select: { id: true, username: true }, where: { token } });
    if (!user) return false;
    req.user = user;
    return true;
  }
}
