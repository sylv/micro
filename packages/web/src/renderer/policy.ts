import { TypePolicies } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';

export const typePolicies: TypePolicies = {
  Config: { keyFields: [] },
  User: {
    keyFields: [],
    fields: {
      files: relayStylePagination(),
      pastes: relayStylePagination(),
    },
  },
};
