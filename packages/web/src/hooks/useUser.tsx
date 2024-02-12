import { useEffect, useState } from 'react';
import { CombinedError, TypedDocumentNode, useMutation, useQuery } from '@urql/preact';
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
  const [, loginMutation] = useMutation(LoginMutation);
  const [login] = useAsync(async (variables: LoginMutationVariables) => {
    try {
      await loginMutation(variables);
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
  const [, logoutMutation] = useMutation(LogoutMutation);
  const [logout] = useAsync(async () => {
    await logoutMutation({});
    reload();
  });

  return { logout };
};

export const useUserRedirect = (
  query: { data?: { user: RegularUserFragment } | null | undefined; fetching: boolean },
  redirect: boolean | undefined,
) => {
  useEffect(() => {
    if (!query.data && !query.fetching && redirect) {
      navigate(`/login?to=${window.location.href}`);
    }
  }, [redirect, query.data, query.fetching]);
};

export const useUser = <T extends TypedDocumentNode<GetUserQuery, any>>(redirect?: boolean, query?: T) => {
  const { login, otpRequired } = useLoginUser();
  const { logout } = useLogoutUser();
  const [{ data, fetching, error }] = useQuery({ query: (query || UserQuery) as T });

  useUserRedirect({ data, fetching }, redirect);

  return {
    data: data?.user as RegularUserFragment | null | undefined,
    fetching: fetching,
    error: error as CombinedError | undefined,
    otpRequired: otpRequired,
    login: login,
    logout: logout,
  } as const;
};
