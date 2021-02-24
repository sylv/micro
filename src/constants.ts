export const EMBEDDABLE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const EMBEDDABLE_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

export enum Endpoints {
  CONFIG = "/api/config",
  USER = "/api/user",
  USER_FILES = "/api/user/files",
  USER_UPLOAD_TOKEN = "/api/user/upload_token",
  AUTH_LOGIN = "/api/auth/login",
  AUTH_LOGOUT = "/api/auth/logout",
}

export enum TokenAudience {
  USER = "USER",
  DELETION = "DELETION",
  INVITE = "INVITE",
}

export enum Permission {
  ADMINISTRATOR = 1,
  CREATE_INVITE = 1 << 1,
  DELETE_USERS = 1 << 2,
}
