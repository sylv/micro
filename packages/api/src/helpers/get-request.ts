import type { ExecutionContext } from '@nestjs/common';
import type { GqlContextType } from '@nestjs/graphql';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { FastifyRequest } from 'fastify';

export const getRequest = (context: ExecutionContext): FastifyRequest => {
  if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  return context.switchToHttp().getRequest<FastifyRequest>();
};
