import { TokenResponse, UserResponse } from "@micro/api";
import axios from "axios";
import Router from "next/router";
import useSWR, { cache, mutate } from "swr";
import { HTTPError } from "../classes/HTTPError";
import { Endpoints, TOKEN_KEY } from "../constants";
import { fetcher } from "../fetcher";

/**
 * Get the user's token from session/local storage, throwing if one isn't found.
 */
export function getToken(): string {
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  if (token) return `Bearer ${token}`;
  throw new HTTPError("Unauthorized", 403);
}

/**
 * Sign the user in with a username/password combo.
 * @param remember Whether to remember the user once they close the page.
 */
export async function login(username: string, password: string, remember: boolean) {
  // todo: this should not be stored in local storage
  const { data } = await axios.post<TokenResponse>(Endpoints.AUTH_TOKEN, { username, password });
  if (!data.access_token) return;
  if (remember) localStorage.setItem(TOKEN_KEY, data.access_token);
  else sessionStorage.setItem(TOKEN_KEY, data.access_token);
  mutate(Endpoints.USER, null, true);
  Router.push("/dashboard");
}

/**
 * Sign the user out.
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  cache.clear();
  mutate(Endpoints.USER, null, false);
  Router.push("/");
}

export const useUser = () => {
  const options = { refreshInterval: 60000, fetcher };
  const user = useSWR<UserResponse>(Endpoints.USER, options);
  const loading = (!user.data && !user.error) || user.isValidating;

  return {
    user: user.data,
    error: user.error,
    mutate: user.mutate,
    loading,
  };
};
