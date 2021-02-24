import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "fastify-cookie";
import fastifyMultipart from "fastify-multipart";
import { RenderService } from "nest-next";
import { nestErrorHandler } from "./helpers/errorHandler";
import { AppModule } from "./modules/AppModule";

async function main() {
  // some routes use jwts in params and they can get very long, hence maxParamLength
  const adapter = new FastifyAdapter({ maxParamLength: 500 });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

  // should probably move this to per-controller or per-route for perf but it's fine for now
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.register(cookie);
  app.register(fastifyMultipart, {
    // fastify-multipart does not throw errors when the payload
    // exceeds this so we handle it ourselves https://tenor.com/6qwu.gif
    // throwFileSizeLimit: true,
    limits: {
      // fileSize: config.uploadLimit,
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 0,
      files: 1,
      headerPairs: 20,
    },
  });

  const service = app.get(RenderService);
  service.setErrorHandler(nestErrorHandler);

  await app.listen(8080, "0.0.0.0");
}

main();
