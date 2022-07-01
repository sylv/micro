import { useState } from 'react';
import { getErrorMessage } from '../helpers/get-error-message.helper';
import { useToasts } from './useToasts';

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
      const message = getErrorMessage(error);
      if (message) {
        createToast({
          error: true,
          text: message,
        });
      }

      setError(error);
    } finally {
      setRunning(false);
    }
  };

  return [run, running, error, result] as const;
}
