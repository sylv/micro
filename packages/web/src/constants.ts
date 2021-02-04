import { GeistUIThemes } from "@geist-ui/react";
import { DeepPartial } from "./types";

export const TOKEN_KEY = "session";
export const THEME_KEY = "theme";
export const DEFAULT_THEME = "dark";

export enum Endpoints {
  CONFIG = "/api/config",
  USER = "/api/user",
  USER_FILES = "/api/user/files",
  USER_TOKEN = "/api/user/token",
  USER_TOKEN_RESET = "/api/user/token/reset",
  AUTH_LOGIN = "/api/auth/login",
  AUTH_LOGOUT = "/api/auth/logout",
}

export const GEIST_THEME: DeepPartial<GeistUIThemes> = {
  type: "light",
  palette: {
    accents_1: "var(--accents-1)",
    accents_2: "var(--accents-2)",
    accents_3: "var(--accents-3)",
    accents_4: "var(--accents-4)",
    accents_5: "var(--accents-5)",
    accents_6: "var(--accents-6)",
    accents_7: "var(--accents-7)",
    accents_8: "var(--accents-8)",
    background: "var(--micro-background)",
    foreground: "var(--micro-foreground)",
    selection: "var(--micro-selection)",
    secondary: "var(--micro-secondary)",
    code: "var(--micro-code)",
    border: "var(--accents-2)",
    link: "var(--micro-link-color)",
  },
  expressiveness: {
    dropdownBoxShadow: "var(--dropdown-box-shadow)",
    shadowSmall: "var(--shadow-small)",
    shadowMedium: "var(--shadow-medium)",
    shadowLarge: "var(--shadow-large)",
    portalOpacity: ("var(--portal-opacity)" as unknown) as number,
  },
  font: {
    mono: "var(--font-mono)",
    sans: "var(--font-sans)",
  },
  layout: {
    radius: "var(--micro-radius)",
  },
};
