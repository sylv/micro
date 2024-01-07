import type { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import type { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';
import { apiUri, isServer } from './helpers/http.helper';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let globalClient: ApolloClient<NormalizedCacheObject> | undefined;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const { message, locations, path } of graphQLErrors) {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError.message}`);
  }
});

function createApolloClient(context?: GetServerSidePropsContext) {
  const httpLink = new HttpLink({
    uri: apiUri + '/graphql',
    credentials: 'same-origin',
    fetch: (url, init) => {
      if (!context) return fetch(url, init);
      return fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          cookie: context.req.headers.cookie as string,
        },
      });
    },
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          keyFields: [],
          fields: {
            files: relayStylePagination(),
            pastes: relayStylePagination(),
          },
        },
        Config: {
          keyFields: [],
        },
      },
    }),
  });
}

export function initializeApollo(options?: { initialState?: any; context?: GetServerSidePropsContext }) {
  const client = globalClient ?? createApolloClient(options?.context);

  if (options?.initialState) {
    const existingCache = client.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, options.initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    });

    client.cache.restore(data);
  }

  // ensure we never use the same client server-side
  // so we're not leaking sessions between requests
  if (isServer) return client;
  if (!globalClient) {
    globalClient = client;
  }

  return client;
}

export function addStateToPageProps(client: ApolloClient<NormalizedCacheObject>, pageProps: any) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  return useMemo(() => {
    return initializeApollo({ initialState: state });
  }, [state]);
}

// here in case future me adds persistent caching and it has to be handled or something
export const resetClient = () => {
  // client.resetStore() does not seem to work, so instead of fighting with apollo over it not clearing hook data,
  // we just reload the entire page which ensures any cache it has is nuked from orbit.
  window.location.href = '/';
};
