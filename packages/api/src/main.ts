import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { fastify } from 'fastify';
import { config } from './config.js';
import { migrate } from './migrate.js';
import { AppModule } from './modules/app.module.js';
import { HostGuard } from './modules/host/host.guard.js';

await migrate();

const logger = new Logger('bootstrap');
const server = fastify({
  trustProxy: process.env.TRUST_PROXY === 'true',
  maxParamLength: 500,
  bodyLimit: config.uploadLimit,
});

const adapter = new FastifyAdapter(server as any);
const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
app.useGlobalGuards(new HostGuard());
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    exceptionFactory(errors) {
      // without this, nestjs won't include validation errors in the graphql response,
      // just a blank bad request error, which is just a little confusing. thanks nestjs!
      const formattedErrors = errors.map((error) => {
        if (error.constraints) {
          const constraints = Object.values(error.constraints);
          if (constraints[0]) return constraints.join(', ');
        }

        return error.toString();
      });

      return new BadRequestException(formattedErrors.join('\n'));
    },
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);

await app.register(fastifyCookie as any);
await app.register(fastifyHelmet.default as any);
await app.register(fastifyMultipart.default as any, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 0,
    files: 1,
    headerPairs: 20,
  },
});

await app.listen(8080, '0.0.0.0', (error, address) => {
  if (error) throw error;
  logger.log(`Listening at ${address}`);
});
