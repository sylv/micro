export const EMBEDDABLE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const EMBEDDABLE_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];
export const IS_DEV = process.env.NODE_ENV !== "production";

export const Endpoints = {
  CONFIG: "/api/config",
  HOSTS: "/api/hosts",
  USER: "/api/user",
  USER_FILES: "/api/user/files",
  USER_TOKEN: "/api/user/token",
  FILE: (fileId: string) => `/api/file/${fileId}`,
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
} as const;

export enum Permission {
  ADMINISTRATOR = 1,
  CREATE_INVITE = 1 << 1,
  DELETE_USERS = 1 << 2,
  ADD_USER_TAGS = 1 << 3,
}
