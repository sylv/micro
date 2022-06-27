import { useEffect, useState } from 'react';

export const useQueryState = <S>(key: string, initialState: S) => {
  const [value, setValue] = useState<S>(initialState);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const value = search.get(key);
    if (value) {
      setValue(value as any);
    }
  }, [key]);

  useEffect(() => {
    const route = new URL(window.location.href);
    if (value === initialState) route.searchParams.delete(key);
    else route.searchParams.set(key, `${value}`);
    history.replaceState(null, '', route.toString());
  }, [value, initialState, key]);

  return [value, setValue] as const;
};
