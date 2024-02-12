import { nanoid } from 'nanoid';
import type { FC, ReactNode } from 'react';
import { useCallback, useState } from 'preact/hooks';
import { Fragment } from 'preact';
import { ToastContext } from './context';
import type { ToastProps } from './toast';
import { TRANSITION_DURATION, Toast } from './toast';

// spread operators on arrays are to fix this
// https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render

export const ToastProvider: FC<{ children: ReactNode }> = (props) => {
  const [toasts, setToasts] = useState<(ToastProps & { id: string; timer: NodeJS.Timeout })[]>([]);
  const createToast = useCallback(
    (toast: ToastProps) => {
      if (toasts.some((existing) => existing.text === toast.text)) {
        // skip duplicate cards
        return;
      }

      const timeout = toast.timeout ?? 5000;
      const id = nanoid();
      const timer = setTimeout(() => {
        // set removing on toast starting the transition
        setToasts((toasts) => {
          for (const toast of toasts) {
            if (toast.id !== id) continue;
            toast.removing = true;
          }

          return [...toasts];
        });

        setTimeout(() => {
          // remove toast once transition is complete
          setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
        }, TRANSITION_DURATION);
      }, timeout - TRANSITION_DURATION);

      // create toast
      setToasts((toasts) => {
        const data = Object.assign(toast, { id, timer });
        return [...toasts, data];
      });
    },
    [toasts, setToasts],
  );

  return (
    <ToastContext.Provider value={createToast}>
      <Fragment>{props.children}</Fragment>
      <div className="fixed flex justify-end bottom-5 right-5 left-5">
        {toasts.map((toast) => (
          <Toast key={toast.id} removing={toast.removing} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
