import useSWR, { cache, mutate } from "swr";
import { Endpoints, TOKEN_KEY } from "../constants";
import { fetcher } from "../fetcher";
import { UserResponse } from "@micro/api";
import { HTTPError } from "../classes/HTTPError";
import Router from "next/router";

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  cache.clear();
  mutate(Endpoints.USER, null, false);
  Router.push("/");
}

export async function login(username: string, password: string, remember: boolean) {
  const res = await fetch(Endpoints.AUTH_TOKEN, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) throw new HTTPError("Invalid username or password", 401);
  if (res.status > 299 || res.status < 200) throw new HTTPError(res.statusText, res.status);
  const body = await res.json();
  if (!body || !body.access_token) return;
  if (remember) localStorage.setItem(TOKEN_KEY, body.access_token);
  else sessionStorage.setItem(TOKEN_KEY, body.access_token);
  mutate(Endpoints.USER, null, true);
  Router.push("/dashboard");
}

export function useUser() {
  const options = { refreshInterval: 60000, fetcher };
  const { data, error, isValidating, mutate } = useSWR<UserResponse>(Endpoints.USER, options);
  const loading = (!data && !error) || isValidating;

  return {
    user: data,
    error,
    loading,
    mutate,
  };
}
