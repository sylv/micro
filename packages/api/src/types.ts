import type { AppController } from "./modules/app.controller";
import type { File } from "./modules/file/file.entity";
import type { HostsController } from "./modules/hosts/hosts.controller";
import type { InviteController } from "./modules/invite/invite.controller";
import type { UserController } from "./modules/user/user.controller";
import type { User } from "./modules/user/user.entity";

export type { File, User };
export type Await<T> = T extends {
  then: (onfulfilled?: (value: infer U) => unknown) => unknown;
}
  ? U
  : T;

// invite
export type GetInviteData = Await<ReturnType<InviteController["getInvite"]>>;

// user
export type GetUserData = Await<ReturnType<UserController["getUser"]>>;
export type GetUserFilesData = Await<ReturnType<UserController["getUserFiles"]>>;
export type GetUploadTokenData = Await<ReturnType<UserController["getUserToken"]>>;
export type PutUploadTokenData = Await<ReturnType<UserController["resetUserToken"]>>;

// file
export type GetFileData = File;

// app
export type GetServerConfigData = Await<ReturnType<AppController["getConfig"]>>;

// hosts
export type GetHostsData = Await<ReturnType<HostsController["getHosts"]>>;
