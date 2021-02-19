import { FastifyReply } from "fastify";
import { RenderableResponse } from "nest-next";
import { File } from "./entities/File";
import { Invite } from "./entities/Invite";
import { Link } from "./entities/Link";
import { User } from "./entities/User";

export type RenderableReply = RenderableResponse & FastifyReply;

export enum TokenAudience {
  USER = "USER",
  DELETION = "DELETION",
}

export enum Permission {
  ADMINISTRATOR = 1,
  CREATE_INVITE = 1 << 1,
  DELETE_USERS = 1 << 2,
}

export interface URLData {
  metadata: string;
  direct?: string;
  view?: string;
  thumbnail?: string | null;
  delete?: string;
}

export type GetInviteData = Invite;
export type GetUserFilesData = File[];
export type GetUserData = User;
export type GetFileData = File;
export type GetLinkData = Link;
export type PutUploadTokenData = GetUploadTokenData;

export interface GetUploadTokenData {
  upload_token: string;
}

export interface GetServerConfigData {
  host: string;
  inquiries: string;
  hosts: string[];
}

export * from "./controllers/AppController";
export * from "./controllers/AuthController";
export * from "./controllers/FileController";
export * from "./controllers/UserController";
export * from "./entities/File";
export * from "./entities/Invite";
export * from "./entities/User";
