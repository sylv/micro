import Router from "next/router";
import useSWR, { mutate } from "swr";
import { Endpoints } from "../constants";
import { http } from "../helpers/http";
import { GetUserData } from "../types";

/**
 * Sign the user in with a username/password combo.
 * @param remember Whether to remember the user once they close the page.
 */
export async function login(username: string, password: string) {
  await http(Endpoints.AUTH_LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  mutate(Endpoints.USER, null, true);
  Router.push("/dashboard");
}

/**
 * Sign the user out.
 */
export async function logout() {
  await http(Endpoints.AUTH_LOGOUT, { method: "POST" });
  mutate(Endpoints.USER, null, false);
  Router.push("/dashboard");
}

export const useUser = () => {
  const user = useSWR<GetUserData>(Endpoints.USER, { refreshInterval: 60000 });
  const loading = (!user.data && !user.error) || user.isValidating;

  return {
    data: user.data,
    error: user.error,
    mutate: user.mutate,
    loading,
  };
};
