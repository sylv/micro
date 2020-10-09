import { useEffect, useState } from "react";

export const usePersistentState = <T = any>(key: string, initialState?: T) => {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const existing = localStorage.getItem(key);
    if (existing) setState(JSON.parse(existing));
  }, []);

  const setStateWrapper = (value: T) => {
    setState(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [state, setStateWrapper] as const;
};
