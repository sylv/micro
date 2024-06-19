import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";

export const useQueryState = <S>(key: string, initialState?: S, parser?: (input: string) => S) => {
  const pageContext = usePageContext();
  const [value, setValue] = useState<S>(() => {
    if (typeof window === "undefined") {
      // during SSR, we can grab query params from the page context
      const value = pageContext.urlParsed.search[key];
      if (value) {
        return parser ? parser(value) : (value as any);
      }
    }

    if (typeof window !== "undefined" && window.location.search) {
      // during
      const search = new URLSearchParams(window.location.search);
      const value = search.get(key);
      if (value) {
        return parser ? parser(value) : (value as any);
      }
    }

    return initialState;
  });

  useEffect(() => {
    const route = new URL(window.location.href);
    if (value === initialState) route.searchParams.delete(key);
    else route.searchParams.set(key, `${value}`);
    history.replaceState(window.history.state, "", route.toString());
  }, [value, initialState, key]);

  return [value, setValue] as const;
};
