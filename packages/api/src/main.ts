import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { fastify } from 'fastify';
import { config } from './config.js';
import { migrate } from './migrate.js';
import { AppModule } from './modules/app.module.js';
import { HostGuard } from './modules/host/host.guard.js';

async function bootstrap() {
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
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  await app.register(fastifyCookie);
  await app.register(fastifyHelmet.default);
  await app.register(fastifyMultipart.default, {
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
}

// top-level await is not supported by ncc
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
