import { ClassSerializerInterceptor, ValidationPipe, InternalServerErrorException } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyMultipart from "fastify-multipart";
import { createStartupInvite } from "./helpers/createStartupInvite";
import { AppModule } from "./modules/AppModule";
import { config } from "./config";
import cookie from "fastify-cookie";
import { RenderService } from "nest-next";
import { FastifyRequest, FastifyReply } from "fastify";

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
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 0,
      fileSize: config.uploadLimit,
      files: 1,
      headerPairs: 20,
    },
  });

  const service = app.get(RenderService);
  service.setErrorHandler(async (err, request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith("/api")) {
      const error = err.response ? err : new InternalServerErrorException(err.message);
      return reply.status(error.status).send(error.response);
    }
  });

  await app.listen(8080, "0.0.0.0");
  await createStartupInvite();
}

main();
