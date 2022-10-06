import { useAsync } from '@ryanke/pandora';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { resetClient } from '../apollo';
import type { LoginMutationVariables } from '../generated/graphql';
import { useGetUserQuery, useLoginMutation, useLogoutMutation } from '../generated/graphql';

export const useUser = (redirect = false) => {
  const user = useGetUserQuery();
  const router = useRouter();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [otp, setOtp] = useState(false);

  const [login] = useAsync(async (variables: LoginMutationVariables) => {
    try {
      await loginMutation({
        variables: variables,
      });

      await user.refetch();
      Router.push('/dashboard');
    } catch (error: any) {
      console.log({ error });
      if (error.message.toLowerCase().includes('otp')) {
        setOtp(true);
      }

      throw error;
    }
  });

  const [logout] = useAsync(async () => {
    await logoutMutation();
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
    otpRequired: otp,
    login: login,
    logout: logout,
  } as const;
};
