import type { CacheExchangeOpts } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";
import { UserQuery } from "../hooks/useUser";

export const cacheOptions: Partial<CacheExchangeOpts> = {
  resolvers: {
    User: {
      files: relayPagination(),
      pastes: relayPagination(),
    },
  },
  keys: {
    User: () => "currentUser",
    Config: () => "config",
    ConfigHost: (host: any) => host.url,
    FileMetadata: () => null,
    ResourceLocations: () => null,
    FilePage: () => null,
    PastePage: () => null,
    PendingOTP: () => null,
  },
  updates: {
    Mutation: {
      disableOTP: (result, args, cache) => {
        cache.invalidate("User");
      },
      confirmOTP: (result, args, cache) => {
        cache.invalidate("User");
      },
      logout: (result, args, cache) => {
        cache.invalidate("User");
      },
      login: (result, args, cache) => {
        cache.updateQuery({ query: UserQuery }, (data) => ({
          user: result.login as any,
        }));
      },
    },
  },
};
