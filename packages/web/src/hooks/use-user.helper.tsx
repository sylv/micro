import { GetUserData } from '@ryanke/micro-api';
import Router from 'next/router';
import useSWR, { mutate } from 'swr';
import { LoginData } from '../components/login-form';
import { http } from '../helpers/http.helper';

/**
 * Sign the user in with a username/password combo.
 * @param remember Whether to remember the user once they close the page.
 */
export async function login(data: LoginData) {
  await http(`auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  mutate(`user`, null, true);
  process.nextTick(() => {
    Router.push('/dashboard');
  });
}

/**
 * Sign the user out.
 */
export async function logout() {
  await http(`auth/logout`, { method: 'POST' });
  mutate(`user`, null, false);
  Router.push('/');
}

export const useUser = () => {
  const user = useSWR<GetUserData>(`user`);
  const loading = (!user.data && !user.error) || user.isValidating;

  return {
    data: user.data,
    error: user.error,
    loading,
  };
};
