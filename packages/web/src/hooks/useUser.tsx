import { useEffect } from "react";
import type { CombinedError } from "urql";
import { useQuery } from "urql";
import { navigate } from "vike/client/router";
import { graphql, type FragmentOf } from "../graphql";
import { useAsync } from "./useAsync";
import { useErrorMutation } from "./useErrorMutation";

export type RegularUserFragment = FragmentOf<typeof RegularUser>;
export const RegularUser = graphql(`
  fragment RegularUser on User @_unmask { 
    id
    username
    email
    verifiedEmail
  }
`);

export const UserQuery = graphql(
  `
  query GetUser {
    user {
      ...RegularUser
    }
  }
`,
  [RegularUser],
);

const LogoutMutation = graphql(`
  mutation Logout {
    logout
  }
`);

export const useLogoutUser = () => {
  const [, logoutMutation] = useErrorMutation(LogoutMutation);
  const [logout] = useAsync(async () => {
    await logoutMutation({});
    // navigate("/");
    window.location.href = "/";
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

export const useUser = (redirect?: boolean) => {
  const { logout } = useLogoutUser();
  const [{ data, fetching, error }] = useQuery({ query: UserQuery });

  useUserRedirect({ data, fetching }, redirect);

  return {
    data: data?.user as RegularUserFragment | null | undefined,
    fetching: fetching,
    error: error as CombinedError | undefined,
    logout: logout,
  } as const;
};
