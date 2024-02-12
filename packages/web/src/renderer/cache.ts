import type { CacheExchangeOpts } from '@urql/exchange-graphcache';
import { relayPagination } from '@urql/exchange-graphcache/extras';

export const cacheOptions: Partial<CacheExchangeOpts> = {
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
