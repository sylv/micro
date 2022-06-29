import { useState } from 'react';
import { HTTPError } from '../helpers/http.helper';
import { useToasts } from './use-toasts.helper';

export function useAsync<T, X extends any[]>(handler: (...params: X) => Promise<T>) {
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);
  const createToast = useToasts();
  const run = async (...params: X) => {
    if (running) {
      return;
    }

    try {
      setRunning(true);
      setError(null);
      const result = await handler(...params);
      setResult(result);
    } catch (error: any) {
      console.error(error);
      if (error instanceof HTTPError) {
        createToast({
          error: true,
          text: error.text,
        });
      }

      setError(error);
    } finally {
      setRunning(false);
    }
  };

  return [run, running, error, result] as const;
}
