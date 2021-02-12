import { RenderableResponse } from "nest-next";
import { FastifyReply } from "fastify";

export * from "./controllers/AppController";
export * from "./controllers/AuthController";
export * from "./controllers/FileController";
export * from "./controllers/UploadController";
export * from "./controllers/UserController";
export * from "./entities/File";
export * from "./entities/User";

export type RenderableReply = RenderableResponse & FastifyReply;
export type Await<T> = T extends PromiseLike<infer U> ? U : T;
