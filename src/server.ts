import { ClassSerializerInterceptor } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyMultipart from "fastify-multipart";
import { ensureDefaultUser } from "./helpers/ensureDefaultUser";
import { AppModule } from "./modules/AppModule";
import { config } from "./config";

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // should probably move this to per-controller or per-route for perf but it's fine for now
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  app.register(fastifyMultipart as any, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 0,
      fileSize: config.upload_limit,
      files: 1,
      headerPairs: 20,
    },
  });
  app.enableCors();

  await app.listen(8080, "0.0.0.0");
  await ensureDefaultUser();
}

main();
