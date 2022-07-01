import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import type { FastifyMultipartOptions } from '@fastify/multipart';
import multipart from '@fastify/multipart';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import createApp from 'fastify';
import { config } from './config';
import { migrate } from './migrate';
import { AppModule } from './modules/app.module';
import { HostGuard } from './modules/host/host.guard';
import { SerializerInterceptor } from './helpers/serializer.interceptor';

const limits: FastifyMultipartOptions = {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 0,
    files: 1,
    headerPairs: 20,
  },
};

async function bootstrap(): Promise<void> {
  const logger = new Logger('bootstrap');
  logger.debug(`Checking for and running migrations`);
  await migrate();
  logger.debug(`Migrations check complete`);
  const fastify = createApp({
    trustProxy: process.env.TRUST_PROXY === 'true',
    maxParamLength: 500,
    bodyLimit: config.uploadLimit,
  });

  const adapter = new FastifyAdapter(fastify as any);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.useGlobalInterceptors(new SerializerInterceptor());
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

  await app.register(cookie as any);
  await app.register(helmet);

  await app.register(multipart as any, limits);
  await app.listen(8080, '0.0.0.0', (error, address) => {
    if (error) throw error;
    logger.log(`Listening at ${address}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
