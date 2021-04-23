import { ClassSerializerInterceptor, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "fastify-cookie";
import multipart from "fastify-multipart";
import { RenderService } from "nest-next";
import { config } from "./config";
import { errorHandler } from "./helpers/errorHandler";
import { RedirectInterceptor } from "./interceptors/redirect.interceptor";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  const adapter = new FastifyAdapter({ maxParamLength: 500 });
  const logger = new Logger("bootstrap");
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector(), {}));
  app.useGlobalInterceptors(new RedirectInterceptor());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }));
  app.register(cookie);
  app.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 0,
      files: 1,
      headerPairs: 20,
    },
  });

  const service = app.get(RenderService);
  service.setErrorHandler(errorHandler);
  await app.listen(8080, "0.0.0.0");
  logger.log(`Ready at ${config.rootHost.url}`);
}

bootstrap();
