import type { CombinedError, TypedDocumentNode } from '@urql/preact';
import { useMutation, useQuery } from '@urql/preact';
import { useEffect } from 'react';
import { graphql } from '../@generated/gql';
import type { GetUserQuery } from '../@generated/graphql';
import { type RegularUserFragment } from '../@generated/graphql';
import { navigate } from '../helpers/routing';
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

const LogoutMutation = graphql(`
  mutation Logout {
    logout
  }
`);

export const useLogoutUser = () => {
  const [, logoutMutation] = useMutation(LogoutMutation);
  const [logout] = useAsync(async () => {
    await logoutMutation({});
    navigate('/');
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
  const { logout } = useLogoutUser();
  const [{ data, fetching, error }] = useQuery({ query: (query || UserQuery) as T });

  useUserRedirect({ data, fetching }, redirect);

  return {
    data: data?.user as RegularUserFragment | null | undefined,
    fetching: fetching,
    error: error as CombinedError | undefined,
    logout: logout,
  } as const;
};
