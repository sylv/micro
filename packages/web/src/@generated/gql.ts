/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  mutation ResendVerificationEmail($data: ResendVerificationEmailDto) {\n    resendVerificationEmail(data: $data)\n  }\n':
    types.ResendVerificationEmailDocument,
  '\n  fragment FileCard on File {\n    id\n    type\n    displayName\n    sizeFormatted\n    thumbnail {\n      width\n      height\n    }\n    paths {\n      thumbnail\n    }\n    urls {\n      view\n    }\n  }\n':
    types.FileCardFragmentDoc,
  '\n  fragment PasteCard on Paste {\n    id\n    title\n    encrypted\n    burn\n    type\n    createdAt\n    expiresAt\n    urls {\n      view\n    }\n  }\n':
    types.PasteCardFragmentDoc,
  '\n  query GetFiles($after: String) {\n    user {\n      files(first: 24, after: $after) {\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        edges {\n          node {\n            id\n            ...FileCard\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFilesDocument,
  '\n  query GetPastes($after: String) {\n    user {\n      pastes(first: 24, after: $after) {\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        edges {\n          node {\n            id\n            ...PasteCard\n          }\n        }\n      }\n    }\n  }\n':
    types.GetPastesDocument,
  '\n  query Config {\n    config {\n      allowTypes\n      inquiriesEmail\n      requireEmails\n      uploadLimit\n      currentHost {\n        normalised\n        redirect\n      }\n      rootHost {\n        normalised\n        url\n      }\n      hosts {\n        normalised\n      }\n    }\n  }\n':
    types.ConfigDocument,
  '\n  fragment RegularUser on User {\n    id\n    username\n    email\n    verifiedEmail\n  }\n':
    types.RegularUserFragmentDoc,
  '\n  query GetUser {\n    user {\n      ...RegularUser\n    }\n  }\n': types.GetUserDocument,
  '\n  mutation Login($username: String!, $password: String!, $otp: String) {\n    login(username: $username, password: $password, otpCode: $otp) {\n      ...RegularUser\n    }\n  }\n':
    types.LoginDocument,
  '\n  mutation Logout {\n    logout\n  }\n': types.LogoutDocument,
  '\n  query GenerateOTP {\n    generateOTP {\n      recoveryCodes\n      qrauthUrl\n      secret\n    }\n  }\n':
    types.GenerateOtpDocument,
  '\n  mutation ConfirmOTP($otpCode: String!) {\n    confirmOTP(otpCode: $otpCode)\n  }\n': types.ConfirmOtpDocument,
  '\n  mutation RefreshToken {\n    refreshToken {\n      ...RegularUser\n    }\n  }\n': types.RefreshTokenDocument,
  '\n  mutation DisableOTP($otpCode: String!) {\n    disableOTP(otpCode: $otpCode)\n  }\n': types.DisableOtpDocument,
  '\n  query UserQueryWithToken {\n    user {\n      ...RegularUser\n      token\n      otpEnabled\n    }\n  }\n':
    types.UserQueryWithTokenDocument,
  '\n  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {\n    changePassword(currentPassword: $oldPassword, newPassword: $newPassword)\n  }\n':
    types.ChangePasswordDocument,
  '\n  query GetFile($fileId: ID!) {\n    file(fileId: $fileId) {\n      id\n      type\n      displayName\n      size\n      sizeFormatted\n      textContent\n      isOwner\n      metadata {\n        height\n        width\n      }\n      paths {\n        view\n        thumbnail\n        direct\n      }\n      urls {\n        view\n      }\n    }\n  }\n':
    types.GetFileDocument,
  '\n  mutation DeleteFile($fileId: ID!, $deleteKey: String) {\n    deleteFile(fileId: $fileId, key: $deleteKey)\n  }\n':
    types.DeleteFileDocument,
  '\n  query GetInvite($inviteId: ID!) {\n    invite(inviteId: $inviteId) {\n      id\n      expiresAt\n    }\n  }\n':
    types.GetInviteDocument,
  '\n  mutation CreateUser($user: CreateUserDto!) {\n    createUser(data: $user) {\n      id\n    }\n  }\n':
    types.CreateUserDocument,
  '\n  mutation CreatePaste($input: CreatePasteDto!) {\n    createPaste(partial: $input) {\n      id\n      urls {\n        view\n      }\n    }\n  }\n':
    types.CreatePasteDocument,
  '\n  query GetPaste($pasteId: ID!) {\n    paste(pasteId: $pasteId) {\n      id\n      title\n      type\n      extension\n      content\n      encrypted\n      createdAt\n      expiresAt\n      burnt\n      burn\n      urls {\n        view\n      }\n    }\n  }\n':
    types.GetPasteDocument,
  '\n  mutation Shorten($link: String!, $host: String) {\n    createLink(destination: $link, host: $host) {\n      id\n      urls {\n        view\n      }\n    }\n  }\n':
    types.ShortenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ResendVerificationEmail($data: ResendVerificationEmailDto) {\n    resendVerificationEmail(data: $data)\n  }\n',
): (typeof documents)['\n  mutation ResendVerificationEmail($data: ResendVerificationEmailDto) {\n    resendVerificationEmail(data: $data)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment FileCard on File {\n    id\n    type\n    displayName\n    sizeFormatted\n    thumbnail {\n      width\n      height\n    }\n    paths {\n      thumbnail\n    }\n    urls {\n      view\n    }\n  }\n',
): (typeof documents)['\n  fragment FileCard on File {\n    id\n    type\n    displayName\n    sizeFormatted\n    thumbnail {\n      width\n      height\n    }\n    paths {\n      thumbnail\n    }\n    urls {\n      view\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PasteCard on Paste {\n    id\n    title\n    encrypted\n    burn\n    type\n    createdAt\n    expiresAt\n    urls {\n      view\n    }\n  }\n',
): (typeof documents)['\n  fragment PasteCard on Paste {\n    id\n    title\n    encrypted\n    burn\n    type\n    createdAt\n    expiresAt\n    urls {\n      view\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFiles($after: String) {\n    user {\n      files(first: 24, after: $after) {\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        edges {\n          node {\n            id\n            ...FileCard\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetFiles($after: String) {\n    user {\n      files(first: 24, after: $after) {\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        edges {\n          node {\n            id\n            ...FileCard\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetPastes($after: String) {\n    user {\n      pastes(first: 24, after: $after) {\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        edges {\n          node {\n            id\n            ...PasteCard\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetPastes($after: String) {\n    user {\n      pastes(first: 24, after: $after) {\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n        edges {\n          node {\n            id\n            ...PasteCard\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Config {\n    config {\n      allowTypes\n      inquiriesEmail\n      requireEmails\n      uploadLimit\n      currentHost {\n        normalised\n        redirect\n      }\n      rootHost {\n        normalised\n        url\n      }\n      hosts {\n        normalised\n      }\n    }\n  }\n',
): (typeof documents)['\n  query Config {\n    config {\n      allowTypes\n      inquiriesEmail\n      requireEmails\n      uploadLimit\n      currentHost {\n        normalised\n        redirect\n      }\n      rootHost {\n        normalised\n        url\n      }\n      hosts {\n        normalised\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RegularUser on User {\n    id\n    username\n    email\n    verifiedEmail\n  }\n',
): (typeof documents)['\n  fragment RegularUser on User {\n    id\n    username\n    email\n    verifiedEmail\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetUser {\n    user {\n      ...RegularUser\n    }\n  }\n',
): (typeof documents)['\n  query GetUser {\n    user {\n      ...RegularUser\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Login($username: String!, $password: String!, $otp: String) {\n    login(username: $username, password: $password, otpCode: $otp) {\n      ...RegularUser\n    }\n  }\n',
): (typeof documents)['\n  mutation Login($username: String!, $password: String!, $otp: String) {\n    login(username: $username, password: $password, otpCode: $otp) {\n      ...RegularUser\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Logout {\n    logout\n  }\n',
): (typeof documents)['\n  mutation Logout {\n    logout\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GenerateOTP {\n    generateOTP {\n      recoveryCodes\n      qrauthUrl\n      secret\n    }\n  }\n',
): (typeof documents)['\n  query GenerateOTP {\n    generateOTP {\n      recoveryCodes\n      qrauthUrl\n      secret\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ConfirmOTP($otpCode: String!) {\n    confirmOTP(otpCode: $otpCode)\n  }\n',
): (typeof documents)['\n  mutation ConfirmOTP($otpCode: String!) {\n    confirmOTP(otpCode: $otpCode)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RefreshToken {\n    refreshToken {\n      ...RegularUser\n    }\n  }\n',
): (typeof documents)['\n  mutation RefreshToken {\n    refreshToken {\n      ...RegularUser\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DisableOTP($otpCode: String!) {\n    disableOTP(otpCode: $otpCode)\n  }\n',
): (typeof documents)['\n  mutation DisableOTP($otpCode: String!) {\n    disableOTP(otpCode: $otpCode)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UserQueryWithToken {\n    user {\n      ...RegularUser\n      token\n      otpEnabled\n    }\n  }\n',
): (typeof documents)['\n  query UserQueryWithToken {\n    user {\n      ...RegularUser\n      token\n      otpEnabled\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {\n    changePassword(currentPassword: $oldPassword, newPassword: $newPassword)\n  }\n',
): (typeof documents)['\n  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {\n    changePassword(currentPassword: $oldPassword, newPassword: $newPassword)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFile($fileId: ID!) {\n    file(fileId: $fileId) {\n      id\n      type\n      displayName\n      size\n      sizeFormatted\n      textContent\n      isOwner\n      metadata {\n        height\n        width\n      }\n      paths {\n        view\n        thumbnail\n        direct\n      }\n      urls {\n        view\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetFile($fileId: ID!) {\n    file(fileId: $fileId) {\n      id\n      type\n      displayName\n      size\n      sizeFormatted\n      textContent\n      isOwner\n      metadata {\n        height\n        width\n      }\n      paths {\n        view\n        thumbnail\n        direct\n      }\n      urls {\n        view\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteFile($fileId: ID!, $deleteKey: String) {\n    deleteFile(fileId: $fileId, key: $deleteKey)\n  }\n',
): (typeof documents)['\n  mutation DeleteFile($fileId: ID!, $deleteKey: String) {\n    deleteFile(fileId: $fileId, key: $deleteKey)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetInvite($inviteId: ID!) {\n    invite(inviteId: $inviteId) {\n      id\n      expiresAt\n    }\n  }\n',
): (typeof documents)['\n  query GetInvite($inviteId: ID!) {\n    invite(inviteId: $inviteId) {\n      id\n      expiresAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateUser($user: CreateUserDto!) {\n    createUser(data: $user) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateUser($user: CreateUserDto!) {\n    createUser(data: $user) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreatePaste($input: CreatePasteDto!) {\n    createPaste(partial: $input) {\n      id\n      urls {\n        view\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation CreatePaste($input: CreatePasteDto!) {\n    createPaste(partial: $input) {\n      id\n      urls {\n        view\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetPaste($pasteId: ID!) {\n    paste(pasteId: $pasteId) {\n      id\n      title\n      type\n      extension\n      content\n      encrypted\n      createdAt\n      expiresAt\n      burnt\n      burn\n      urls {\n        view\n      }\n    }\n  }\n',
): (typeof documents)['\n  query GetPaste($pasteId: ID!) {\n    paste(pasteId: $pasteId) {\n      id\n      title\n      type\n      extension\n      content\n      encrypted\n      createdAt\n      expiresAt\n      burnt\n      burn\n      urls {\n        view\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Shorten($link: String!, $host: String) {\n    createLink(destination: $link, host: $host) {\n      id\n      urls {\n        view\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation Shorten($link: String!, $host: String) {\n    createLink(destination: $link, host: $host) {\n      id\n      urls {\n        view\n      }\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
