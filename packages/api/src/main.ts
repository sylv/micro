import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "fastify-cookie";
import multipart, { FastifyMultipartOptions } from "fastify-multipart";
import { AppModule } from "./modules/app.module";
import { HostsGuard } from "./modules/hosts/hosts.guard";

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
  const adapter = new FastifyAdapter({ maxParamLength: 500 });
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector(), {}));
  app.useGlobalGuards(new HostsGuard());
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

  app.register(cookie as any);
  app.register(multipart as any, limits);

  await app.listen(8080, "0.0.0.0", (error, address) => {
    if (error) throw error;
    logger.log(`Listening at ${address}`);
  });
}

bootstrap();
