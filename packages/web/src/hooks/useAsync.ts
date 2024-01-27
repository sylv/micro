import { useState } from "react";

export function useAsync<T, X extends any[]>(handler: (...params: X) => Promise<T>) {
  const [promise, setPromise] = useState<Promise<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const running = !!promise;
  const run = async (...params: X) => {
    if (promise) {
      return promise;
    }

    try {
      const promise = handler(...params);
      setPromise(promise);
      setError(null);
      const result = await promise;
      setResult(result);
    } catch (error: any) {
      setError(error);
      throw error;
    } finally {
      setPromise(null);
    }
  };

  return [run, running, error, result] as const;
}
