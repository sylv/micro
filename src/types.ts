import { FastifyReply } from "fastify";
import { RenderableResponse } from "nest-next";
import { JWTPayloadInvite } from "./services/InviteService";
import { File } from "./entities/File";
import { Link } from "./entities/Link";
import { User } from "./entities/User";

export type RenderableReply = RenderableResponse & FastifyReply;

export type GetInviteData = JWTPayloadInvite;
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

export * from "./entities/File";
export * from "./entities/User";
export * from "./entities/Thumbnail";
