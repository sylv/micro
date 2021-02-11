import { UserResponse } from "@micro/api";
import Router from "next/router";
import useSWR, { mutate } from "swr";
import { Endpoints } from "../constants";

/**
 * Sign the user in with a username/password combo.
 * @param remember Whether to remember the user once they close the page.
 */
export async function login(username: string, password: string) {
  const response = await fetch(Endpoints.AUTH_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  mutate(Endpoints.USER, null, true);
  Router.push("/dashboard");
}

/**
 * Sign the user out.
 */
export async function logout() {
  const response = await fetch(Endpoints.AUTH_LOGOUT);
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
  mutate(Endpoints.USER, null, true);
  Router.push("/dashboard");
}

export const useUser = () => {
  const user = useSWR<UserResponse>(Endpoints.USER, { refreshInterval: 60000 });
  const loading = (!user.data && !user.error) || user.isValidating;

  return {
    data: user.data,
    error: user.error,
    mutate: user.mutate,
    loading,
  };
};
