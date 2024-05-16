/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type Config = {
  __typename?: 'Config';
  allowTypes: Array<Scalars['String']['output']>;
  /** The host the request is being made to. This host may not be in the hosts list if the user is not authorized to access it. */
  currentHost: ConfigHost;
  /** A list of hosts the user can access. */
  hosts: Array<ConfigHost>;
  inquiriesEmail: Scalars['String']['output'];
  requireEmails: Scalars['Boolean']['output'];
  rootHost: ConfigHost;
  uploadLimit: Scalars['Float']['output'];
};

export type ConfigHost = {
  __typename?: 'ConfigHost';
  normalised: Scalars['String']['output'];
  redirect?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type CreatePasteDto = {
  burn: Scalars['Boolean']['input'];
  content: Scalars['String']['input'];
  encrypted: Scalars['Boolean']['input'];
  expiresAt?: InputMaybe<Scalars['Float']['input']>;
  extension?: InputMaybe<Scalars['String']['input']>;
  hostname?: InputMaybe<Scalars['String']['input']>;
  paranoid: Scalars['Boolean']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserDto = {
  email?: InputMaybe<Scalars['String']['input']>;
  invite: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type File = {
  __typename?: 'File';
  createdAt: Scalars['DateTime']['output'];
  displayName: Scalars['String']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isExternal: Scalars['Boolean']['output'];
  isOwner: Scalars['Boolean']['output'];
  metadata?: Maybe<FileMetadata>;
  name?: Maybe<Scalars['String']['output']>;
  paths: ResourceLocations;
  size: Scalars['Float']['output'];
  sizeFormatted: Scalars['String']['output'];
  textContent?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Thumbnail>;
  type: Scalars['String']['output'];
  urls: ResourceLocations;
};

export type FileMetadata = {
  __typename?: 'FileMetadata';
  height?: Maybe<Scalars['Float']['output']>;
  width?: Maybe<Scalars['Float']['output']>;
};

export type FilePage = {
  __typename?: 'FilePage';
  edges: Array<FilePageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type FilePageEdge = {
  __typename?: 'FilePageEdge';
  cursor: Scalars['String']['output'];
  node: File;
};

export type Invite = {
  __typename?: 'Invite';
  consumed: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  expired: Scalars['Boolean']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  path: Scalars['String']['output'];
  permissions?: Maybe<Scalars['Float']['output']>;
  skipVerification: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type Link = {
  __typename?: 'Link';
  clicks: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  destination: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  paths: ResourceLocations;
  urls: ResourceLocations;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: Scalars['Boolean']['output'];
  confirmOTP: Scalars['Boolean']['output'];
  createInvite: Invite;
  createLink: Link;
  createPaste: Paste;
  createUser: User;
  deleteFile: Scalars['Boolean']['output'];
  disableOTP: Scalars['Boolean']['output'];
  login: User;
  logout: Scalars['Boolean']['output'];
  refreshToken: User;
  resendVerificationEmail: Scalars['Boolean']['output'];
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationConfirmOtpArgs = {
  otpCode: Scalars['String']['input'];
};


export type MutationCreateLinkArgs = {
  destination: Scalars['String']['input'];
  host?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreatePasteArgs = {
  partial: CreatePasteDto;
};


export type MutationCreateUserArgs = {
  data: CreateUserDto;
};


export type MutationDeleteFileArgs = {
  fileId: Scalars['ID']['input'];
  key?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDisableOtpArgs = {
  otpCode: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  otpCode?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationResendVerificationEmailArgs = {
  data?: InputMaybe<ResendVerificationEmailDto>;
};

export type OtpEnabledDto = {
  __typename?: 'OTPEnabledDto';
  qrauthUrl: Scalars['String']['output'];
  recoveryCodes: Array<Scalars['String']['output']>;
  secret: Scalars['String']['output'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Paste = {
  __typename?: 'Paste';
  burn: Scalars['Boolean']['output'];
  burnt?: Maybe<Scalars['Boolean']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  encrypted: Scalars['Boolean']['output'];
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  extension?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  paths: ResourceLocations;
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  urls: ResourceLocations;
};

export type PastePage = {
  __typename?: 'PastePage';
  edges: Array<PastePageEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PastePageEdge = {
  __typename?: 'PastePageEdge';
  cursor: Scalars['String']['output'];
  node: Paste;
};

export type Query = {
  __typename?: 'Query';
  config: Config;
  file: File;
  generateOTP: OtpEnabledDto;
  invite: Invite;
  link: Link;
  paste: Paste;
  user: User;
};


export type QueryFileArgs = {
  fileId: Scalars['ID']['input'];
};


export type QueryInviteArgs = {
  inviteId: Scalars['ID']['input'];
};


export type QueryLinkArgs = {
  linkId: Scalars['ID']['input'];
};


export type QueryPasteArgs = {
  pasteId: Scalars['ID']['input'];
};

export type ResendVerificationEmailDto = {
  email: Scalars['String']['input'];
};

export type ResourceLocations = {
  __typename?: 'ResourceLocations';
  delete?: Maybe<Scalars['String']['output']>;
  direct: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  view: Scalars['String']['output'];
};

export type Thumbnail = {
  __typename?: 'Thumbnail';
  createdAt: Scalars['DateTime']['output'];
  duration: Scalars['Float']['output'];
  height: Scalars['Float']['output'];
  size: Scalars['Float']['output'];
  type: Scalars['String']['output'];
  width: Scalars['Float']['output'];
};

export type User = {
  __typename?: 'User';
  aggregateFileSize: Scalars['Float']['output'];
  email?: Maybe<Scalars['String']['output']>;
  files: FilePage;
  id: Scalars['ID']['output'];
  otpEnabled: Scalars['Boolean']['output'];
  pastes: PastePage;
  permissions: Scalars['Float']['output'];
  tags: Array<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  username: Scalars['String']['output'];
  verifiedEmail: Scalars['Boolean']['output'];
};


export type UserFilesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
};


export type UserPastesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
};

export type ResendVerificationEmailMutationVariables = Exact<{
  data?: InputMaybe<ResendVerificationEmailDto>;
}>;


export type ResendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: boolean };

export type FileCardFragment = { __typename?: 'File', id: string, type: string, displayName: string, sizeFormatted: string, thumbnail?: { __typename?: 'Thumbnail', width: number, height: number } | null, paths: { __typename?: 'ResourceLocations', thumbnail?: string | null }, urls: { __typename?: 'ResourceLocations', view: string } };

export type PasteCardFragment = { __typename?: 'Paste', id: string, title?: string | null, encrypted: boolean, burn: boolean, type: string, createdAt: any, expiresAt?: any | null, urls: { __typename?: 'ResourceLocations', view: string } };

export type GetFilesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFilesQuery = { __typename?: 'Query', user: { __typename?: 'User', files: { __typename?: 'FilePage', pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, edges: Array<{ __typename?: 'FilePageEdge', node: { __typename?: 'File', id: string, type: string, displayName: string, sizeFormatted: string, thumbnail?: { __typename?: 'Thumbnail', width: number, height: number } | null, paths: { __typename?: 'ResourceLocations', thumbnail?: string | null }, urls: { __typename?: 'ResourceLocations', view: string } } }> } } };

export type GetPastesQueryVariables = Exact<{
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPastesQuery = { __typename?: 'Query', user: { __typename?: 'User', pastes: { __typename?: 'PastePage', pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean }, edges: Array<{ __typename?: 'PastePageEdge', node: { __typename?: 'Paste', id: string, title?: string | null, encrypted: boolean, burn: boolean, type: string, createdAt: any, expiresAt?: any | null, urls: { __typename?: 'ResourceLocations', view: string } } }> } } };

export type LoginMutationVariables = Exact<{
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  otp?: InputMaybe<Scalars['String']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean } };

export type ConfigQueryVariables = Exact<{ [key: string]: never; }>;


export type ConfigQuery = { __typename?: 'Query', config: { __typename?: 'Config', allowTypes: Array<string>, inquiriesEmail: string, requireEmails: boolean, uploadLimit: number, currentHost: { __typename?: 'ConfigHost', normalised: string, redirect?: string | null }, rootHost: { __typename?: 'ConfigHost', normalised: string, url: string }, hosts: Array<{ __typename?: 'ConfigHost', normalised: string }> } };

export type RegularUserFragment = { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type GenerateOtpQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateOtpQuery = { __typename?: 'Query', generateOTP: { __typename?: 'OTPEnabledDto', recoveryCodes: Array<string>, qrauthUrl: string, secret: string } };

export type ConfirmOtpMutationVariables = Exact<{
  otpCode: Scalars['String']['input'];
}>;


export type ConfirmOtpMutation = { __typename?: 'Mutation', confirmOTP: boolean };

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'User', id: string, username: string, email?: string | null, verifiedEmail: boolean } };

export type DisableOtpMutationVariables = Exact<{
  otpCode: Scalars['String']['input'];
}>;


export type DisableOtpMutation = { __typename?: 'Mutation', disableOTP: boolean };

export type UserQueryWithTokenQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQueryWithTokenQuery = { __typename?: 'Query', user: { __typename?: 'User', token: string, otpEnabled: boolean, id: string, username: string, email?: string | null, verifiedEmail: boolean } };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: boolean };

export type GetFileQueryVariables = Exact<{
  fileId: Scalars['ID']['input'];
}>;


export type GetFileQuery = { __typename?: 'Query', file: { __typename?: 'File', id: string, type: string, displayName: string, size: number, sizeFormatted: string, textContent?: string | null, isOwner: boolean, metadata?: { __typename?: 'FileMetadata', height?: number | null, width?: number | null } | null, paths: { __typename?: 'ResourceLocations', view: string, thumbnail?: string | null, direct: string }, urls: { __typename?: 'ResourceLocations', view: string } } };

export type DeleteFileMutationVariables = Exact<{
  fileId: Scalars['ID']['input'];
  deleteKey?: InputMaybe<Scalars['String']['input']>;
}>;


export type DeleteFileMutation = { __typename?: 'Mutation', deleteFile: boolean };

export type GetInviteQueryVariables = Exact<{
  inviteId: Scalars['ID']['input'];
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
  pasteId: Scalars['ID']['input'];
}>;


export type GetPasteQuery = { __typename?: 'Query', paste: { __typename?: 'Paste', id: string, title?: string | null, type: string, extension?: string | null, content: string, encrypted: boolean, createdAt: any, expiresAt?: any | null, burnt?: boolean | null, burn: boolean, urls: { __typename?: 'ResourceLocations', view: string } } };

export type ShortenMutationVariables = Exact<{
  link: Scalars['String']['input'];
  host?: InputMaybe<Scalars['String']['input']>;
}>;


export type ShortenMutation = { __typename?: 'Mutation', createLink: { __typename?: 'Link', id: string, urls: { __typename?: 'ResourceLocations', view: string } } };

export const FileCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"sizeFormatted"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]} as unknown as DocumentNode<FileCardFragment, unknown>;
export const PasteCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Paste"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"encrypted"}},{"kind":"Field","name":{"kind":"Name","value":"burn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]} as unknown as DocumentNode<PasteCardFragment, unknown>;
export const RegularUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RegularUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedEmail"}}]}}]} as unknown as DocumentNode<RegularUserFragment, unknown>;
export const ResendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendVerificationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ResendVerificationEmailDto"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendVerificationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<ResendVerificationEmailMutation, ResendVerificationEmailMutationVariables>;
export const GetFilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"files"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"24"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"FileCard"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"FileCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"File"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"sizeFormatted"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]} as unknown as DocumentNode<GetFilesQuery, GetFilesQueryVariables>;
export const GetPastesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPastes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pastes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"24"}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PasteCard"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PasteCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Paste"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"encrypted"}},{"kind":"Field","name":{"kind":"Name","value":"burn"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]} as unknown as DocumentNode<GetPastesQuery, GetPastesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otp"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"otpCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RegularUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RegularUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedEmail"}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const ConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allowTypes"}},{"kind":"Field","name":{"kind":"Name","value":"inquiriesEmail"}},{"kind":"Field","name":{"kind":"Name","value":"requireEmails"}},{"kind":"Field","name":{"kind":"Name","value":"uploadLimit"}},{"kind":"Field","name":{"kind":"Name","value":"currentHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"normalised"}},{"kind":"Field","name":{"kind":"Name","value":"redirect"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rootHost"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"normalised"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"hosts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"normalised"}}]}}]}}]}}]} as unknown as DocumentNode<ConfigQuery, ConfigQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RegularUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RegularUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedEmail"}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const GenerateOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GenerateOTP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateOTP"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"recoveryCodes"}},{"kind":"Field","name":{"kind":"Name","value":"qrauthUrl"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}}]}}]}}]} as unknown as DocumentNode<GenerateOtpQuery, GenerateOtpQueryVariables>;
export const ConfirmOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otpCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"otpCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otpCode"}}}]}]}}]} as unknown as DocumentNode<ConfirmOtpMutation, ConfirmOtpMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RegularUser"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RegularUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedEmail"}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const DisableOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisableOTP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"otpCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disableOTP"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"otpCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"otpCode"}}}]}]}}]} as unknown as DocumentNode<DisableOtpMutation, DisableOtpMutationVariables>;
export const UserQueryWithTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserQueryWithToken"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RegularUser"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"otpEnabled"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RegularUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedEmail"}}]}}]} as unknown as DocumentNode<UserQueryWithTokenQuery, UserQueryWithTokenQueryVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"currentPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const GetFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"file"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"sizeFormatted"}},{"kind":"Field","name":{"kind":"Name","value":"textContent"}},{"kind":"Field","name":{"kind":"Name","value":"isOwner"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"width"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paths"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"direct"}}]}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]}}]} as unknown as DocumentNode<GetFileQuery, GetFileQueryVariables>;
export const DeleteFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deleteKey"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}},{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deleteKey"}}}]}]}}]} as unknown as DocumentNode<DeleteFileMutation, DeleteFileMutationVariables>;
export const GetInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inviteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]} as unknown as DocumentNode<GetInviteQuery, GetInviteQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreatePasteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePaste"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePasteDto"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPaste"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partial"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]}}]} as unknown as DocumentNode<CreatePasteMutation, CreatePasteMutationVariables>;
export const GetPasteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPaste"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pasteId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paste"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pasteId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pasteId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"extension"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"encrypted"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}},{"kind":"Field","name":{"kind":"Name","value":"burnt"}},{"kind":"Field","name":{"kind":"Name","value":"burn"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]}}]} as unknown as DocumentNode<GetPasteQuery, GetPasteQueryVariables>;
export const ShortenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Shorten"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"link"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"host"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"destination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"link"}}},{"kind":"Argument","name":{"kind":"Name","value":"host"},"value":{"kind":"Variable","name":{"kind":"Name","value":"host"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"urls"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"view"}}]}}]}}]}}]} as unknown as DocumentNode<ShortenMutation, ShortenMutationVariables>;