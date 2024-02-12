import { CacheExchangeOpts } from '@urql/exchange-graphcache';
import { relayPagination } from '@urql/exchange-graphcache/extras';

import schema from '../@generated/introspection.json';

export const cacheOptions: Partial<CacheExchangeOpts> = {
  schema: schema,
  resolvers: {
    User: {
      files: relayPagination(),
      pastes: relayPagination(),
    },
  },
  keys: {
    User: () => null,
    Config: () => null,
    ConfigHost: () => null,
    FileMetadata: () => null,
    ResourceLocations: () => null,
    FilePage: () => null,
    PastePage: () => null,
    OTPEnabledDto: () => null,
  },
  updates: {
    Mutation: {
      disableOTP: (result, args, cache) => {
        cache.invalidate('Query', 'user');
      },
    },
  },
};
