import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { relayStylePagination } from '@apollo/client/utilities';

export const client = new ApolloClient({
  link: new BatchHttpLink({ uri: '/api/graphql', batchInterval: 5 }),
  cache: new InMemoryCache({
    typePolicies: {
      Config: {
        keyFields: [],
      },
      User: {
        keyFields: [],
        fields: {
          files: relayStylePagination(),
          pastes: relayStylePagination(),
        },
      },
    },
  }),
});

// here in case future me adds persistent caching and it has to be handled or something
export const resetClient = () => {
  // client.resetStore() does not seem to work, so instead of fighting with apollo over it not clearing hook data,
  // we just reload the entire page which ensures any cache it has is nuked from orbit.
  window.location.href = '/';
};
