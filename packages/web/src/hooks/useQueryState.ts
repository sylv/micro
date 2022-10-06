import { useEffect, useState } from 'react';

export const useQueryState = <S>(key: string, initialState?: S, parser?: (input: string) => S) => {
  const [value, setValue] = useState<S>(initialState as any);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const value = search.get(key);
    if (value) {
      const result = parser ? parser(value) : (value as any);
      setValue(result);
    }
  }, []);

  useEffect(() => {
    const route = new URL(window.location.href);
    if (value === initialState) route.searchParams.delete(key);
    else route.searchParams.set(key, `${value}`);
    history.replaceState(null, '', route.toString());
  }, [value, initialState, key]);

  return [value, setValue] as const;
};
