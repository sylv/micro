import type { File, Link, User } from "@prisma/client";
import type { FastifyReply } from "fastify";
import type { RenderableResponse } from "nest-next";
import type { AppController } from "./modules/app.controller";
import type { FileController } from "./modules/file/file.controller";
import { HostsController } from "./modules/hosts/hosts.controller";
import type { InviteController } from "./modules/invite/invite.controller";
import type { LinkController } from "./modules/link/link.controller";
import type { UserController } from "./modules/user/user.controller";

export type { File, User, Link };
export type RenderableReply = RenderableResponse & FastifyReply;
export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

// invite
export type GetInviteData = Await<ReturnType<InviteController["get"]>>;

// user
export type GetUserData = Await<ReturnType<UserController["get"]>>;
export type GetUserFilesData = Await<ReturnType<UserController["getFiles"]>>;
export type GetUploadTokenData = Await<ReturnType<UserController["getToken"]>>;
export type PutUploadTokenData = Await<ReturnType<UserController["resetToken"]>>;

// file
export type GetFileData = Await<ReturnType<FileController["get"]>>;

// link
export type GetLinkData = Await<ReturnType<LinkController["get"]>>;

// app
export type GetServerConfigData = Await<ReturnType<AppController["getConfig"]>>;

// hosts
export type GetHostsData = Await<ReturnType<HostsController["get"]>>;
