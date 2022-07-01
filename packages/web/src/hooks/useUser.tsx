import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { resetClient } from '../apollo';
import type { LoginData } from '../components/login-form';
import { useGetUserQuery } from '../generated/graphql';
import { http } from '../helpers/http.helper';
import { useAsync } from './useAsync';

export const useUser = (redirect = false) => {
  const user = useGetUserQuery();
  const router = useRouter();

  const [login] = useAsync(async (data: LoginData) => {
    await http(`auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    await user.refetch();
    Router.push('/dashboard');
  });

  const [logout] = useAsync(async () => {
    await http(`auth/logout`, { method: 'POST' });
    resetClient();
  });

  useEffect(() => {
    if (!user.data && !user.loading && redirect) {
      router.push(`/login?to=${router.asPath}`);
    }
  }, [router, redirect, user.data, user.loading]);

  return {
    data: user.data?.user,
    error: user.error,
    loading: user.loading,
    login: login,
    logout: logout,
  } as const;
};
