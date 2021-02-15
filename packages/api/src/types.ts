import { RenderableResponse } from "nest-next";
import { FastifyReply } from "fastify";
import { UserController } from "./controllers/UserController";

export * from "./controllers/AppController";
export * from "./controllers/AuthController";
export * from "./controllers/FileController";
export * from "./controllers/UserController";
export * from "./entities/File";
export * from "./entities/User";
export * from "./entities/Invite";

export type RenderableReply = RenderableResponse & FastifyReply;
export type Await<T> = T extends PromiseLike<infer U> ? U : T;

export type GetUserData = Await<ReturnType<UserController["getUser"]>>;
export type GetUserFilesData = Await<ReturnType<UserController["getUserFiles"]>>;
export type GetUploadTokenData = Await<ReturnType<UserController["getUserUploadToken"]>>;
export type PutUploadTokenData = Await<ReturnType<UserController["getUserUploadToken"]>>;

export enum TokenAudience {
  USER = "USER",
  DELETION = "DELETION",
}
