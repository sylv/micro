import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "fastify-cookie";
import multipart from "fastify-multipart";
import { RenderService } from "nest-next";
import { errorHandler } from "./helpers/errorHandler";
import { AppModule } from "./modules/app.module";

async function main() {
  const adapter = new FastifyAdapter({ maxParamLength: 500 });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector(), {}));
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
}

main();
