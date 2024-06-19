import { uneval } from "devalue";
import { useMemo } from "react";
import { useStream } from "react-streaming";
import { createClient, errorExchange, fetchExchange } from "urql";
import { usePageContext } from "vike-react/usePageContext";
import { serializeResult } from "../helpers/serializeResult.helper";
import { cacheExchange } from "@urql/exchange-graphcache";
import { cacheOptions } from "./cache";
import type { PageContext } from "vike/types";

export const GRAPHQL_URL =
  (import.meta.env.PUBLIC_ENV__FRONTEND_API_URL || import.meta.env.FRONTEND_API_URL) + "/graphql";

export const useServerClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("useServerClient should only be used on the server.");
  }

  const pageContext = usePageContext();
  const stream = useStream();
  if (stream == null) throw new Error("streaming is disabled or unavailable");

  return useMemo(() => {
    stream.injectToStream("<script>if(typeof window.__c=='undefined')__c=[]</script>");

    if (!pageContext.ssrExchange) {
      throw new Error("pageContext.ssrExchange is required.");
    }

    // inject data from getServerClient()
    const extracted = pageContext.ssrExchange?.extractData();
    if (extracted) {
      for (const [key, value] of Object.entries(extracted)) {
        const serialized = uneval(value); // already serialized
        stream.injectToStream(`<script>__c.push(["${key}",${serialized}])</script>`);
      }
    }

    return createClient({
      url: GRAPHQL_URL,
      suspense: true,
      exchanges: [
        // cache exchange is doing almost nothing here - its only used to add __typename which is necessary
        // when we get to the client for computing keys. we could remove it if we could add __typename some other way.
        cacheExchange(cacheOptions),
        // this is what we use for caching on the server, getServerClient() uses the same instance
        // which stores results and stops us fetching something twice
        pageContext.ssrExchange,
        errorExchange({
          // write new data to the stream
          onResult: (result) => {
            if (!result.operation.key) return;
            const serialized = uneval(serializeResult(result, false));
            stream.injectToStream(`<script>__c.push(["${result.operation.key}",${serialized}])</script>`);
          },
        }),
        fetchExchange,
      ],
      fetchOptions: {
        credentials: "same-origin",
        headers: pageContext.headers || undefined,
      },
    });
  }, []);
};

export const getServerClient = (pageContext: PageContext) => {
  if (typeof window !== "undefined") {
    throw new Error("getServerClient should only be used on the server.");
  }

  if (!pageContext.ssrExchange) {
    throw new Error("pageContext.ssrExchange is required.");
  }

  return createClient({
    url: GRAPHQL_URL,
    exchanges: [cacheExchange(cacheOptions), pageContext.ssrExchange, fetchExchange],
    fetchOptions: {
      credentials: "same-origin",
      headers: pageContext.headers || undefined,
    },
  });
};
