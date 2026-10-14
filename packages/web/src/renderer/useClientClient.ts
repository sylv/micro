import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, fetchExchange, ssrExchange, type Client, type SSRData } from "urql";
import { cacheOptions } from "./cache";

type CacheEntry = [string, SSRData];

let browserClient: Client | undefined;

declare global {
  interface Window {
    __c?: { push: (data: CacheEntry) => void } | CacheEntry[];
  }
}

export const useClientClient = () => {
  if (typeof window === "undefined") {
    throw new Error("useClient should only be used on the client.");
  }

  // Hydration recovery and remounts must reuse the client that owns the SSR stream.
  if (browserClient) return browserClient;

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

  browserClient = client;
  return client;
};
