import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { useMemo } from "react";
import { createClient, fetchExchange, ssrExchange, type SSRData } from "urql";
import { cacheOptions } from "./cache";

type CacheEntry = [string, SSRData];

declare global {
  interface Window {
    __c?: { push: (data: CacheEntry) => void } | CacheEntry[];
  }
}

export const useClientClient = () => {
  if (typeof window === "undefined") {
    throw new Error("useClient should only be used on the client.");
  }

  return useMemo(() => {
    if (!Array.isArray(window.__c)) {
      // react strict mode re-renders components multiple times to check for side effects
      // that breaks this component because the first time we grab the window data, then the second
      // there is nothing to grab which causes SSR differences. this ensures that we only mount once
      throw new Error("Wrapper should only be mounted once, problem may be React.StrictMode");
    }

    const ssr = ssrExchange({ isClient: true });
    const client = createClient({
      url: "/api/graphql",
      exchanges: [devtoolsExchange, cacheExchange(cacheOptions), ssr, fetchExchange],
    });

    const onEntry = (entry: CacheEntry) => {
      const partial = { [entry[0]]: entry[1] };
      ssr.restoreData(partial);
    };

    if (Array.isArray(window.__c)) {
      // restore data from the server
      for (const entry of window.__c) {
        onEntry(entry);
      }
    }

    // if new data comes in from the server, restore that too
    window.__c = { push: onEntry };

    return client;
  }, []);
};
