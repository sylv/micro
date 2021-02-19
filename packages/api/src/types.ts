import { FastifyReply } from "fastify";
import { RenderableResponse } from "nest-next";
import { APIFile } from "./entities/File";
import { APILink } from "./entities/Link";
import { User } from "./entities/User";
import Invite from "./entities/Invite";

export * from "./controllers/AppController";
export * from "./controllers/AuthController";
export * from "./controllers/FileController";
export * from "./controllers/UserController";
export * from "./entities/File";
export * from "./entities/Invite";
export * from "./entities/User";

export type RenderableReply = RenderableResponse & FastifyReply;

export enum TokenAudience {
  USER = "USER",
  DELETION = "DELETION",
}

export type GetInviteData = Invite;
export type GetUserFilesData = APIFile[];
export type GetUserData = User;
export type GetFileData = APIFile;
export type GetLinkData = APILink;
export type PutUploadTokenData = GetUploadTokenData;

export interface GetUploadTokenData {
  upload_token: string;
}

export interface GetServerConfigData {
  host: string;
  inquiries: string;
  hosts: string[];
}
