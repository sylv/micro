import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Config = {
  __typename?: 'Config';
  allowTypes: Array<Scalars['String']>;
  /** The host the request is being made to. This host may not be in the hosts list if the user is not authorized to access it. */
  currentHost: ConfigHost;
  /** A list of hosts the user can access. */
  hosts: Array<ConfigHost>;
  inquiriesEmail: Scalars['String'];
  requireEmails: Scalars['Boolean'];
  rootHost: ConfigHost;
  uploadLimit: Scalars['Float'];
};

export type ConfigHost = {
  __typename?: 'ConfigHost';
  normalised: Scalars['String'];
  redirect?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type CreatePasteDto = {
  burn: Scalars['Boolean'];
  content: Scalars['String'];
  encrypted: Scalars['Boolean'];
  expiresAt?: InputMaybe<Scalars['Float']>;
  extension?: InputMaybe<Scalars['String']>;
  hostname?: InputMaybe<Scalars['String']>;
  paranoid: Scalars['Boolean'];
  title?: InputMaybe<Scalars['String']>;
};

export type CreateUserDto = {
  email?: InputMaybe<Scalars['String']>;
  invite: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['DateTime'];
  displayName: Scalars['String'];
  hash: Scalars['String'];
  id: Scalars['ID'];
  isOwner: Scalars['Boolean'];
  metadata?: Maybe<FileMetadata>;
  name?: Maybe<Scalars['String']>;
  paths: ResourceLocations;
  size: Scalars['Float'];
  sizeFormatted: Scalars['String'];
  thumbnail?: Maybe<Thumbnail>;
  type: Scalars['String'];
  urls: ResourceLocations;
};

export type FileMetadata = {
  __typename?: 'FileMetadata';
  height?: Maybe<Scalars['Float']>;
  width?: Maybe<Scalars['Float']>;
};

export type FilePage = {
  __typename?: 'FilePage';
  edges: Array<FilePageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FilePageEdge = {
  __typename?: 'FilePageEdge';
  cursor: Scalars['String'];
  node: File;
};

export type Invite = {
  __typename?: 'Invite';
  consumed: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  expired: Scalars['Boolean'];
  expiresAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  path: Scalars['String'];
  permissions?: Maybe<Scalars['Float']>;
  url: Scalars['String'];
};

export type Link = {
  __typename?: 'Link';
  clicks: Scalars['Float'];
  createdAt: Scalars['DateTime'];
  destination: Scalars['String'];
  id: Scalars['ID'];
  paths: ResourceLocations;
  urls: ResourceLocations;
};

export type Mutation = {
  __typename?: 'Mutation';
  confirmOTP: Scalars['Boolean'];
  createInvite: Invite;
  createLink: Link;
  createPaste: Paste;
  createUser: User;
  deleteFile: Scalars['Boolean'];
  disableOTP: Scalars['Boolean'];
  generateOTP: OtpEnabledDto;
  login: User;
  logout: Scalars['Boolean'];
  refreshToken: User;
  resendVerificationEmail: Scalars['Boolean'];
};


export type MutationConfirmOtpArgs = {
  otpCode: Scalars['String'];
};


export type MutationCreateLinkArgs = {
  destination: Scalars['String'];
  host?: InputMaybe<Scalars['String']>;
};


export type MutationCreatePasteArgs = {
  partial: CreatePasteDto;
};


export type MutationCreateUserArgs = {
  data: CreateUserDto;
};


export type MutationDeleteFileArgs = {
  fileId: Scalars['ID'];
  key?: InputMaybe<Scalars['String']>;
};


export type MutationDisableOtpArgs = {
  otpCode: Scalars['String'];
};


export type MutationLoginArgs = {
  otpCode?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationResendVerificationEmailArgs = {
  data?: InputMaybe<ResendVerificationEmailDto>;
};

export type OtpEnabledDto = {
  __typename?: 'OTPEnabledDto';
  qrauthUrl: Scalars['String'];
  recoveryCodes: Array<Scalars['String']>;
  secret: Scalars['String'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Paste = {
  __typename?: 'Paste';
  burn: Scalars['Boolean'];
  burnt?: Maybe<Scalars['Boolean']>;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  encrypted: Scalars['Boolean'];
  expiresAt?: Maybe<Scalars['DateTime']>;
  extension?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  paths: ResourceLocations;
  title?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  urls: ResourceLocations;
};

export type PastePage = {
  __typename?: 'PastePage';
  edges: Array<PastePageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PastePageEdge = {
  __typename?: 'PastePageEdge';
  cursor: Scalars['String'];
  node: Paste;
};

export type Query = {
  __typename?: 'Query';
  config: Config;
  file: File;
  invite: Invite;
  link: Link;
  paste: Paste;
  user: User;
};


export type QueryFileArgs = {
  fileId: Scalars['ID'];
};


export type QueryInviteArgs = {
  inviteId: Scalars['ID'];
};


export type QueryLinkArgs = {
  linkId: Scalars['ID'];
};


export type QueryPasteArgs = {
  pasteId: Scalars['ID'];
};

export type ResendVerificationEmailDto = {
  email: Scalars['String'];
};

export type ResourceLocations = {
  __typename?: 'ResourceLocations';
  delete?: Maybe<Scalars['String']>;
  direct: Scalars['String'];
  thumbnail?: Maybe<Scalars['String']>;
  view: Scalars['String'];
};

export type Thumbnail = {
  __typename?: 'Thumbnail';
  createdAt: Scalars['DateTime'];
  duration: Scalars['Float'];
  height: Scalars['Float'];
  size: Scalars['Float'];
  type: Scalars['String'];
  width: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  aggregateFileSize: Scalars['Float'];
  email?: Maybe<Scalars['String']>;
  files: FilePage;
  id: Scalars['ID'];
  otpEnabled: Scalars['Boolean'];
  pastes: PastePage;
  permissions: Scalars['Float'];
  tags: Array<Scalars['String']>;
  token: Scalars['String'];
  username: Scalars['String'];
  verifiedEmail: Scalars['Boolean'];
};


export type UserFilesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Float']>;
};


export type UserPastesArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Float']>;
};

export type ResendVerificationEmailMutationVariables = Exact<{
  data?: InputMaybe<ResendVerificationEmailDto>;
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: boolean };

export type PasteCardFragment = { __typename?: 'Paste', id: string, title?: string | null, encrypted: boolean, burn: boolean, type: string, createdAt: any, expiresAt?: any | null, urls: { __typename?: 'ResourceLocations', view: string } };

export type FileCardFragment = { __typename?: 'File', id: string, type: string, displayName: string, sizeFormatted: string, thumbnail?: { __typename?: 'Thumbnail', width: number, height: number } | null, paths: { __typename?: 'ResourceLocations', thumbnail?: string | null }, urls: { __typename?: 'ResourceLocations', view: string } };

export type GetFilesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetFilesQuery = { __typename?: 'Query', user: { __typename?: 'User', files: { __typename?: 'FilePage', pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, edges: Array<{ __typename?: 'FilePageEdge', node: { __typename?: 'File', id: string, type: string, displayName: string, sizeFormatted: string, thumbnail?: { __typename?: 'Thumbnail', width: number, height: number } | null, paths: { __typename?: 'ResourceLocations', thumbnail?: string | null }, urls: { __typename?: 'ResourceLocations', view: string } } }> } } };

export type GetPastesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Float']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetPastesQuery = { __typename?: 'Query', user: { __typename?: 'User', pastes: { __typename?: 'PastePage', pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, edges: Array<{ __typename?: 'PastePageEdge', node: { __typename?: 'Paste', id: string, title?: string | null, encrypted: boolean, burn: boolean, type: string, createdAt: any, expiresAt?: any | null, urls: { __typename?: 'ResourceLocations', view: string } } }> } } };

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'Query', config: { __typename?: 'Config', allowTypes: Array<string>, inquiriesEmail: string, requireEmails: boolean, uploadLimit: number, currentHost: { __typename?: 'ConfigHost', normalised: string, redirect?: string | null }, rootHost: { __typename?: 'ConfigHost', normalised: string, url: string }, hosts: Array<{ __typename?: 'ConfigHost', normalised: string }> } };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', otpEnabled: boolean, id: string, username: string, email?: string | null, verifiedEmail: boolean, token: string } };

export type RegularUserFragment = { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean, token: string };

export type LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
  otp?: InputMaybe<Scalars['String']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean, token: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GenerateOtpMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateOtpMutation = { __typename?: 'Mutation', generateOTP: { __typename?: 'OTPEnabledDto', recoveryCodes: Array<string>, qrauthUrl: string, secret: string } };

export type ConfirmOtpMutationVariables = Exact<{
  otpCode: Scalars['String'];
}>;


export type ConfirmOtpMutation = { __typename?: 'Mutation', confirmOTP: boolean };

export type DisableOtpMutationVariables = Exact<{
  otpCode: Scalars['String'];
}>;


export type DisableOtpMutation = { __typename?: 'Mutation', disableOTP: boolean };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean, token: string } };

export type GetFileQueryVariables = Exact<{
  fileId: Scalars['ID'];
}>;


export type GetFileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, type: string, displayName: string, size: number, sizeFormatted: string, isOwner: boolean, metadata?: { __typename?: 'FileMetadata', height?: number | null, width?: number | null } | null, paths: { __typename?: 'ResourceLocations', view: string, thumbnail?: string | null, direct: string }, urls: { __typename?: 'ResourceLocations', view: string } } };

export type DeleteFileMutationVariables = Exact<{
  fileId: Scalars['ID'];
  deleteKey?: InputMaybe<Scalars['String']>;
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: boolean };

export type GetInviteQueryVariables = Exact<{
  inviteId: Scalars['ID'];
}>;


export type GetInviteQuery = { __typename?: 'Query', invite: { __typename?: 'Invite', id: string, expiresAt?: any | null } };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserDto;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string } };

export type CreatePasteMutationVariables = Exact<{
  input: CreatePasteDto;
}>;


export type CreatePasteMutation = { __typename?: 'Mutation', createPaste: { __typename?: 'Paste', id: string, urls: { __typename?: 'ResourceLocations', view: string } } };

export type GetPasteQueryVariables = Exact<{
  pasteId: Scalars['ID'];
}>;


export type GetPasteQuery = { __typename?: 'Query', paste: { __typename?: 'Paste', id: string, title?: string | null, type: string, extension?: string | null, content: string, encrypted: boolean, createdAt: any, expiresAt?: any | null, burnt?: boolean | null, burn: boolean, urls: { __typename?: 'ResourceLocations', view: string } } };

export type ShortenMutationVariables = Exact<{
  link: Scalars['String'];
  host?: InputMaybe<Scalars['String']>;
}>;


export type ShortenMutation = { __typename?: 'Mutation', createLink: { __typename?: 'Link', id: string, urls: { __typename?: 'ResourceLocations', view: string } } };

export const PasteCardFragmentDoc = gql`
    fragment PasteCard on Paste {
  id
  title
  encrypted
  burn
  type
  createdAt
  expiresAt
  urls {
    view
  }
}
    `;
export const FileCardFragmentDoc = gql`
    fragment FileCard on File {
  id
  type
  displayName
  sizeFormatted
  thumbnail {
    width
    height
  }
  paths {
    thumbnail
  }
  urls {
    view
  }
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  verifiedEmail
  token
}
    `;
export const ResendVerificationEmailDocument = gql`
    mutation ResendVerificationEmail($data: ResendVerificationEmailDto) {
  resendVerificationEmail(data: $data)
}
    `;
export type ResendVerificationEmailMutationFn = Apollo.MutationFunction<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>(ResendVerificationEmailDocument, options);
      }
export type ResendVerificationEmailMutationHookResult = ReturnType<typeof useResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationResult = Apollo.MutationResult<ResendVerificationEmailMutation>;
export type ResendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const GetFilesDocument = gql`
    query GetFiles($first: Float, $after: String) {
  user {
    files(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...FileCard
        }
      }
    }
  }
}
    ${FileCardFragmentDoc}`;

/**
 * __useGetFilesQuery__
 *
 * To run a query within a React component, call `useGetFilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFilesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetFilesQuery(baseOptions?: Apollo.QueryHookOptions<GetFilesQuery, GetFilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFilesQuery, GetFilesQueryVariables>(GetFilesDocument, options);
      }
export function useGetFilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFilesQuery, GetFilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFilesQuery, GetFilesQueryVariables>(GetFilesDocument, options);
        }
export type GetFilesQueryHookResult = ReturnType<typeof useGetFilesQuery>;
export type GetFilesLazyQueryHookResult = ReturnType<typeof useGetFilesLazyQuery>;
export type GetFilesQueryResult = Apollo.QueryResult<GetFilesQuery, GetFilesQueryVariables>;
export const GetPastesDocument = gql`
    query GetPastes($first: Float, $after: String) {
  user {
    pastes(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ...PasteCard
        }
      }
    }
  }
}
    ${PasteCardFragmentDoc}`;

/**
 * __useGetPastesQuery__
 *
 * To run a query within a React component, call `useGetPastesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPastesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPastesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useGetPastesQuery(baseOptions?: Apollo.QueryHookOptions<GetPastesQuery, GetPastesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPastesQuery, GetPastesQueryVariables>(GetPastesDocument, options);
      }
export function useGetPastesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPastesQuery, GetPastesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPastesQuery, GetPastesQueryVariables>(GetPastesDocument, options);
        }
export type GetPastesQueryHookResult = ReturnType<typeof useGetPastesQuery>;
export type GetPastesLazyQueryHookResult = ReturnType<typeof useGetPastesLazyQuery>;
export type GetPastesQueryResult = Apollo.QueryResult<GetPastesQuery, GetPastesQueryVariables>;
export const ConfigDocument = gql`
    query Config {
  config {
    allowTypes
    inquiriesEmail
    requireEmails
    uploadLimit
    currentHost {
      normalised
      redirect
    }
    rootHost {
      normalised
      url
    }
    hosts {
      normalised
    }
  }
}
    `;

/**
 * __useConfigQuery__
 *
 * To run a query within a React component, call `useConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfigQuery({
 *   variables: {
 *   },
 * });
 */
export function useConfigQuery(baseOptions?: Apollo.QueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, options);
      }
export function useConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConfigQuery, ConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConfigQuery, ConfigQueryVariables>(ConfigDocument, options);
        }
export type ConfigQueryHookResult = ReturnType<typeof useConfigQuery>;
export type ConfigLazyQueryHookResult = ReturnType<typeof useConfigLazyQuery>;
export type ConfigQueryResult = Apollo.QueryResult<ConfigQuery, ConfigQueryVariables>;
export const GetUserDocument = gql`
    query GetUser {
  user {
    ...RegularUser
    otpEnabled
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserQuery(baseOptions?: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const LoginDocument = gql`
    mutation Login($username: String!, $password: String!, $otp: String) {
  login(username: $username, password: $password, otpCode: $otp) {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      otp: // value for 'otp'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GenerateOtpDocument = gql`
    mutation GenerateOTP {
  generateOTP {
    recoveryCodes
    qrauthUrl
    secret
  }
}
    `;
export type GenerateOtpMutationFn = Apollo.MutationFunction<GenerateOtpMutation, GenerateOtpMutationVariables>;

/**
 * __useGenerateOtpMutation__
 *
 * To run a mutation, you first call `useGenerateOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateOtpMutation, { data, loading, error }] = useGenerateOtpMutation({
 *   variables: {
 *   },
 * });
 */
export function useGenerateOtpMutation(baseOptions?: Apollo.MutationHookOptions<GenerateOtpMutation, GenerateOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateOtpMutation, GenerateOtpMutationVariables>(GenerateOtpDocument, options);
      }
export type GenerateOtpMutationHookResult = ReturnType<typeof useGenerateOtpMutation>;
export type GenerateOtpMutationResult = Apollo.MutationResult<GenerateOtpMutation>;
export type GenerateOtpMutationOptions = Apollo.BaseMutationOptions<GenerateOtpMutation, GenerateOtpMutationVariables>;
export const ConfirmOtpDocument = gql`
    mutation ConfirmOTP($otpCode: String!) {
  confirmOTP(otpCode: $otpCode)
}
    `;
export type ConfirmOtpMutationFn = Apollo.MutationFunction<ConfirmOtpMutation, ConfirmOtpMutationVariables>;

/**
 * __useConfirmOtpMutation__
 *
 * To run a mutation, you first call `useConfirmOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmOtpMutation, { data, loading, error }] = useConfirmOtpMutation({
 *   variables: {
 *      otpCode: // value for 'otpCode'
 *   },
 * });
 */
export function useConfirmOtpMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmOtpMutation, ConfirmOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmOtpMutation, ConfirmOtpMutationVariables>(ConfirmOtpDocument, options);
      }
export type ConfirmOtpMutationHookResult = ReturnType<typeof useConfirmOtpMutation>;
export type ConfirmOtpMutationResult = Apollo.MutationResult<ConfirmOtpMutation>;
export type ConfirmOtpMutationOptions = Apollo.BaseMutationOptions<ConfirmOtpMutation, ConfirmOtpMutationVariables>;
export const DisableOtpDocument = gql`
    mutation DisableOTP($otpCode: String!) {
  disableOTP(otpCode: $otpCode)
}
    `;
export type DisableOtpMutationFn = Apollo.MutationFunction<DisableOtpMutation, DisableOtpMutationVariables>;

/**
 * __useDisableOtpMutation__
 *
 * To run a mutation, you first call `useDisableOtpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableOtpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableOtpMutation, { data, loading, error }] = useDisableOtpMutation({
 *   variables: {
 *      otpCode: // value for 'otpCode'
 *   },
 * });
 */
export function useDisableOtpMutation(baseOptions?: Apollo.MutationHookOptions<DisableOtpMutation, DisableOtpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DisableOtpMutation, DisableOtpMutationVariables>(DisableOtpDocument, options);
      }
export type DisableOtpMutationHookResult = ReturnType<typeof useDisableOtpMutation>;
export type DisableOtpMutationResult = Apollo.MutationResult<DisableOtpMutation>;
export type DisableOtpMutationOptions = Apollo.BaseMutationOptions<DisableOtpMutation, DisableOtpMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken {
  refreshToken {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const GetFileDocument = gql`
    query GetFile($fileId: ID!) {
  file(fileId: $fileId) {
    id
    type
    displayName
    size
    sizeFormatted
    isOwner
    metadata {
      height
      width
    }
    paths {
      view
      thumbnail
      direct
    }
    urls {
      view
    }
  }
}
    `;

/**
 * __useGetFileQuery__
 *
 * To run a query within a React component, call `useGetFileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileQuery({
 *   variables: {
 *      fileId: // value for 'fileId'
 *   },
 * });
 */
export function useGetFileQuery(baseOptions: Apollo.QueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
      }
export function useGetFileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileQuery, GetFileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFileQuery, GetFileQueryVariables>(GetFileDocument, options);
        }
export type GetFileQueryHookResult = ReturnType<typeof useGetFileQuery>;
export type GetFileLazyQueryHookResult = ReturnType<typeof useGetFileLazyQuery>;
export type GetFileQueryResult = Apollo.QueryResult<GetFileQuery, GetFileQueryVariables>;
export const DeleteFileDocument = gql`
    mutation DeleteFile($fileId: ID!, $deleteKey: String) {
  deleteFile(fileId: $fileId, key: $deleteKey)
}
    `;
export type DeleteFileMutationFn = Apollo.MutationFunction<DeleteFileMutation, DeleteFileMutationVariables>;

/**
 * __useDeleteFileMutation__
 *
 * To run a mutation, you first call `useDeleteFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFileMutation, { data, loading, error }] = useDeleteFileMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *      deleteKey: // value for 'deleteKey'
 *   },
 * });
 */
export function useDeleteFileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFileMutation, DeleteFileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFileMutation, DeleteFileMutationVariables>(DeleteFileDocument, options);
      }
export type DeleteFileMutationHookResult = ReturnType<typeof useDeleteFileMutation>;
export type DeleteFileMutationResult = Apollo.MutationResult<DeleteFileMutation>;
export type DeleteFileMutationOptions = Apollo.BaseMutationOptions<DeleteFileMutation, DeleteFileMutationVariables>;
export const GetInviteDocument = gql`
    query GetInvite($inviteId: ID!) {
  invite(inviteId: $inviteId) {
    id
    expiresAt
  }
}
    `;

/**
 * __useGetInviteQuery__
 *
 * To run a query within a React component, call `useGetInviteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInviteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInviteQuery({
 *   variables: {
 *      inviteId: // value for 'inviteId'
 *   },
 * });
 */
export function useGetInviteQuery(baseOptions: Apollo.QueryHookOptions<GetInviteQuery, GetInviteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInviteQuery, GetInviteQueryVariables>(GetInviteDocument, options);
      }
export function useGetInviteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInviteQuery, GetInviteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInviteQuery, GetInviteQueryVariables>(GetInviteDocument, options);
        }
export type GetInviteQueryHookResult = ReturnType<typeof useGetInviteQuery>;
export type GetInviteLazyQueryHookResult = ReturnType<typeof useGetInviteLazyQuery>;
export type GetInviteQueryResult = Apollo.QueryResult<GetInviteQuery, GetInviteQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($user: CreateUserDto!) {
  createUser(data: $user) {
    id
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      user: // value for 'user'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const CreatePasteDocument = gql`
    mutation CreatePaste($input: CreatePasteDto!) {
  createPaste(partial: $input) {
    id
    urls {
      view
    }
  }
}
    `;
export type CreatePasteMutationFn = Apollo.MutationFunction<CreatePasteMutation, CreatePasteMutationVariables>;

/**
 * __useCreatePasteMutation__
 *
 * To run a mutation, you first call `useCreatePasteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePasteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPasteMutation, { data, loading, error }] = useCreatePasteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePasteMutation(baseOptions?: Apollo.MutationHookOptions<CreatePasteMutation, CreatePasteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePasteMutation, CreatePasteMutationVariables>(CreatePasteDocument, options);
      }
export type CreatePasteMutationHookResult = ReturnType<typeof useCreatePasteMutation>;
export type CreatePasteMutationResult = Apollo.MutationResult<CreatePasteMutation>;
export type CreatePasteMutationOptions = Apollo.BaseMutationOptions<CreatePasteMutation, CreatePasteMutationVariables>;
export const GetPasteDocument = gql`
    query GetPaste($pasteId: ID!) {
  paste(pasteId: $pasteId) {
    id
    title
    type
    extension
    content
    encrypted
    createdAt
    expiresAt
    burnt
    burn
    urls {
      view
    }
  }
}
    `;

/**
 * __useGetPasteQuery__
 *
 * To run a query within a React component, call `useGetPasteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPasteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPasteQuery({
 *   variables: {
 *      pasteId: // value for 'pasteId'
 *   },
 * });
 */
export function useGetPasteQuery(baseOptions: Apollo.QueryHookOptions<GetPasteQuery, GetPasteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPasteQuery, GetPasteQueryVariables>(GetPasteDocument, options);
      }
export function useGetPasteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPasteQuery, GetPasteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPasteQuery, GetPasteQueryVariables>(GetPasteDocument, options);
        }
export type GetPasteQueryHookResult = ReturnType<typeof useGetPasteQuery>;
export type GetPasteLazyQueryHookResult = ReturnType<typeof useGetPasteLazyQuery>;
export type GetPasteQueryResult = Apollo.QueryResult<GetPasteQuery, GetPasteQueryVariables>;
export const ShortenDocument = gql`
    mutation Shorten($link: String!, $host: String) {
  createLink(destination: $link, host: $host) {
    id
    urls {
      view
    }
  }
}
    `;
export type ShortenMutationFn = Apollo.MutationFunction<ShortenMutation, ShortenMutationVariables>;

/**
 * __useShortenMutation__
 *
 * To run a mutation, you first call `useShortenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useShortenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [shortenMutation, { data, loading, error }] = useShortenMutation({
 *   variables: {
 *      link: // value for 'link'
 *      host: // value for 'host'
 *   },
 * });
 */
export function useShortenMutation(baseOptions?: Apollo.MutationHookOptions<ShortenMutation, ShortenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ShortenMutation, ShortenMutationVariables>(ShortenDocument, options);
      }
export type ShortenMutationHookResult = ReturnType<typeof useShortenMutation>;
export type ShortenMutationResult = Apollo.MutationResult<ShortenMutation>;
export type ShortenMutationOptions = Apollo.BaseMutationOptions<ShortenMutation, ShortenMutationVariables>;