import { TypedDocumentNode, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { graphql } from '../@generated';
import type { GetUserQuery, LoginMutationVariables, RegularUserFragment } from '../@generated/graphql';
import { navigate, reload } from '../helpers/routing';
import { useAsync } from './useAsync';

const RegularUserFragment = graphql(`
  fragment RegularUser on User {
    id
    username
    email
    verifiedEmail
  }
`);

const UserQuery = graphql(`
  query GetUser {
    user {
      ...RegularUser
    }
  }
`);

const LoginMutation = graphql(`
  mutation Login($username: String!, $password: String!, $otp: String) {
    login(username: $username, password: $password, otpCode: $otp) {
      ...RegularUser
    }
  }
`);

const LogoutMutation = graphql(`
  mutation Logout {
    logout
  }
`);

export const useLoginUser = () => {
  const [otp, setOtp] = useState(false);
  const [loginMutation] = useMutation(LoginMutation);
  const [login] = useAsync(async (variables: LoginMutationVariables) => {
    try {
      await loginMutation({ variables });
      navigate('/dashboard');
    } catch (error: any) {
      if (error.message.toLowerCase().includes('otp')) {
        setOtp(true);
      }

      throw error;
    }
  });

  return {
    login,
    otpRequired: otp,
  };
};

export const useLogoutUser = () => {
  const [logoutMutation] = useMutation(LogoutMutation);
  const [logout] = useAsync(async () => {
    await logoutMutation({});
    reload();
  });

  return { logout };
};

export const useUserRedirect = (
  data: RegularUserFragment | null | undefined,
  loading: boolean,
  redirect: boolean | undefined,
) => {
  useEffect(() => {
    if (!data && !loading && redirect) {
      navigate(`/login?to=${window.location.href}`);
    }
  }, [redirect, data, loading]);
};

export const useUser = <T extends TypedDocumentNode<GetUserQuery, any>>(redirect?: boolean, query?: T) => {
  const { login, otpRequired } = useLoginUser();
  const { logout } = useLogoutUser();
  const { data, loading, error } = useQuery((query || UserQuery) as T);

  useUserRedirect(data?.user, loading, redirect);

  return {
    data: data?.user as RegularUserFragment | null | undefined,
    loading: loading,
    error: error,
    otpRequired: otpRequired,
    login: login,
    logout: logout,
  } as const;
};
