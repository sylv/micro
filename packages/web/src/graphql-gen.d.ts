/* eslint-disable */
/* prettier-ignore */

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: 'Mutation';
  subscription: never;
  types: {
    'Boolean': unknown;
    'Config': { kind: 'OBJECT'; name: 'Config'; fields: { 'allowTypes': { name: 'allowTypes'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; } }; 'currentHost': { name: 'currentHost'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ConfigHost'; ofType: null; }; } }; 'hosts': { name: 'hosts'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ConfigHost'; ofType: null; }; }; }; } }; 'inquiriesEmail': { name: 'inquiriesEmail'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'requireEmails': { name: 'requireEmails'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'rootHost': { name: 'rootHost'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ConfigHost'; ofType: null; }; } }; 'uploadLimit': { name: 'uploadLimit'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; }; };
    'ConfigHost': { kind: 'OBJECT'; name: 'ConfigHost'; fields: { 'normalised': { name: 'normalised'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'redirect': { name: 'redirect'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'url': { name: 'url'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'CreatePasteDto': { kind: 'INPUT_OBJECT'; name: 'CreatePasteDto'; isOneOf: false; inputFields: [{ name: 'burn'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; }; defaultValue: null }, { name: 'content'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'encrypted'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; }; defaultValue: null }, { name: 'expiresAt'; type: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; defaultValue: null }, { name: 'extension'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'hostname'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'paranoid'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; }; defaultValue: null }, { name: 'title'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }]; };
    'CreateUserDto': { kind: 'INPUT_OBJECT'; name: 'CreateUserDto'; isOneOf: false; inputFields: [{ name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; }; defaultValue: null }, { name: 'invite'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'password'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'username'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }]; };
    'DateTime': unknown;
    'File': { kind: 'OBJECT'; name: 'File'; fields: { 'createdAt': { name: 'createdAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; }; } }; 'displayName': { name: 'displayName'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'external': { name: 'external'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'hash': { name: 'hash'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'isOwner': { name: 'isOwner'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'metadata': { name: 'metadata'; type: { kind: 'OBJECT'; name: 'FileMetadata'; ofType: null; } }; 'name': { name: 'name'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'paths': { name: 'paths'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ResourceLocations'; ofType: null; }; } }; 'size': { name: 'size'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'sizeFormatted': { name: 'sizeFormatted'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'textContent': { name: 'textContent'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'thumbnail': { name: 'thumbnail'; type: { kind: 'OBJECT'; name: 'Thumbnail'; ofType: null; } }; 'type': { name: 'type'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'urls': { name: 'urls'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ResourceLocations'; ofType: null; }; } }; }; };
    'FileEntityPageEdge': { kind: 'OBJECT'; name: 'FileEntityPageEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'File'; ofType: null; }; } }; }; };
    'FileMetadata': { kind: 'OBJECT'; name: 'FileMetadata'; fields: { 'height': { name: 'height'; type: { kind: 'SCALAR'; name: 'Float'; ofType: null; } }; 'width': { name: 'width'; type: { kind: 'SCALAR'; name: 'Float'; ofType: null; } }; }; };
    'FilePage': { kind: 'OBJECT'; name: 'FilePage'; fields: { 'edges': { name: 'edges'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'FileEntityPageEdge'; ofType: null; }; }; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; 'totalCount': { name: 'totalCount'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; }; };
    'Float': unknown;
    'ID': unknown;
    'Int': unknown;
    'Invite': { kind: 'OBJECT'; name: 'Invite'; fields: { 'consumed': { name: 'consumed'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; }; } }; 'expired': { name: 'expired'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'expiresAt': { name: 'expiresAt'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'path': { name: 'path'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'permissions': { name: 'permissions'; type: { kind: 'SCALAR'; name: 'Float'; ofType: null; } }; 'skipVerification': { name: 'skipVerification'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'url': { name: 'url'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Link': { kind: 'OBJECT'; name: 'Link'; fields: { 'clicks': { name: 'clicks'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; }; } }; 'destination': { name: 'destination'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'paths': { name: 'paths'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ResourceLocations'; ofType: null; }; } }; 'urls': { name: 'urls'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ResourceLocations'; ofType: null; }; } }; }; };
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'changePassword': { name: 'changePassword'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'confirmOTP': { name: 'confirmOTP'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'createInvite': { name: 'createInvite'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Invite'; ofType: null; }; } }; 'createLink': { name: 'createLink'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Link'; ofType: null; }; } }; 'createPaste': { name: 'createPaste'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Paste'; ofType: null; }; } }; 'createUser': { name: 'createUser'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; 'deleteFile': { name: 'deleteFile'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'disableOTP': { name: 'disableOTP'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'login': { name: 'login'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; 'logout': { name: 'logout'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'refreshToken': { name: 'refreshToken'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; 'resendVerificationEmail': { name: 'resendVerificationEmail'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; }; };
    'PageInfo': { kind: 'OBJECT'; name: 'PageInfo'; fields: { 'endCursor': { name: 'endCursor'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'hasNextPage': { name: 'hasNextPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'hasPreviousPage': { name: 'hasPreviousPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'startCursor': { name: 'startCursor'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
    'Paste': { kind: 'OBJECT'; name: 'Paste'; fields: { 'burn': { name: 'burn'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'burnt': { name: 'burnt'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'content': { name: 'content'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'createdAt': { name: 'createdAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; }; } }; 'encrypted': { name: 'encrypted'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'expiresAt': { name: 'expiresAt'; type: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; } }; 'extension': { name: 'extension'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'paths': { name: 'paths'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ResourceLocations'; ofType: null; }; } }; 'title': { name: 'title'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'type': { name: 'type'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'urls': { name: 'urls'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'ResourceLocations'; ofType: null; }; } }; }; };
    'PasteEntityPageEdge': { kind: 'OBJECT'; name: 'PasteEntityPageEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Paste'; ofType: null; }; } }; }; };
    'PastePage': { kind: 'OBJECT'; name: 'PastePage'; fields: { 'edges': { name: 'edges'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PasteEntityPageEdge'; ofType: null; }; }; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; 'totalCount': { name: 'totalCount'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Int'; ofType: null; }; } }; }; };
    'PendingOTP': { kind: 'OBJECT'; name: 'PendingOTP'; fields: { 'qrauthUrl': { name: 'qrauthUrl'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'recoveryCodes': { name: 'recoveryCodes'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; } }; 'secret': { name: 'secret'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'config': { name: 'config'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Config'; ofType: null; }; } }; 'file': { name: 'file'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'File'; ofType: null; }; } }; 'generateOTP': { name: 'generateOTP'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PendingOTP'; ofType: null; }; } }; 'invite': { name: 'invite'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Invite'; ofType: null; }; } }; 'link': { name: 'link'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Link'; ofType: null; }; } }; 'paste': { name: 'paste'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Paste'; ofType: null; }; } }; 'user': { name: 'user'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'User'; ofType: null; }; } }; }; };
    'ResendVerificationEmailDto': { kind: 'INPUT_OBJECT'; name: 'ResendVerificationEmailDto'; isOneOf: false; inputFields: [{ name: 'email'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }]; };
    'ResourceLocations': { kind: 'OBJECT'; name: 'ResourceLocations'; fields: { 'delete': { name: 'delete'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'direct': { name: 'direct'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'thumbnail': { name: 'thumbnail'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'view': { name: 'view'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'String': unknown;
    'Thumbnail': { kind: 'OBJECT'; name: 'Thumbnail'; fields: { 'createdAt': { name: 'createdAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'DateTime'; ofType: null; }; } }; 'duration': { name: 'duration'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'height': { name: 'height'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'size': { name: 'size'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'type': { name: 'type'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'width': { name: 'width'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; }; };
    'User': { kind: 'OBJECT'; name: 'User'; fields: { 'aggregateFileSize': { name: 'aggregateFileSize'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'email': { name: 'email'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'files': { name: 'files'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'FilePage'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'otpEnabled': { name: 'otpEnabled'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'pastes': { name: 'pastes'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PastePage'; ofType: null; }; } }; 'permissions': { name: 'permissions'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Float'; ofType: null; }; } }; 'tags': { name: 'tags'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; }; } }; 'token': { name: 'token'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'username': { name: 'username'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'verifiedEmail': { name: 'verifiedEmail'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; }; };
  };
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}