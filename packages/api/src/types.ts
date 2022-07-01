import type { AppController } from './modules/app.controller';
import type { File } from './modules/file/file.entity';
import type { InviteController } from './modules/invite/invite.controller';
import type { CreatePasteDto, Paste } from './modules/paste/paste.entity';
import type { UserController } from './modules/user/user.controller';

export type Await<T> = T extends {
  then: (onfulfilled?: (value: infer U) => unknown) => unknown;
}
  ? U
  : T;

// invite
export type GetInviteData = Await<ReturnType<InviteController['getInvite']>>;

// user
export type GetUserData = Await<ReturnType<UserController['getUser']>>;
export type GetUserFilesData = Await<ReturnType<UserController['getUserFiles']>>;
export type GetUserPastesData = Await<ReturnType<UserController['getUserPastes']>>;
export type GetUploadTokenData = Await<ReturnType<UserController['getUserToken']>>;
export type PutUploadTokenData = Await<ReturnType<UserController['resetUserToken']>>;

// file
export type GetFileData = File;

// app
export type GetServerConfigData = Await<ReturnType<AppController['getConfig']>>;

export type GetPasteData = Paste;
export type CreatePasteBody = CreatePasteDto;

export { Resource as ResourceBase } from './helpers/resource.entity-base';
export type { ResourcePaths } from './helpers/resource.entity-base';
export { File } from './modules/file/file.entity';
export { User } from './modules/user/user.entity';
