import { nanoid } from 'nanoid';
import type { FC, ReactNode } from 'react';
import React, { useCallback, useState } from 'react';
import type { ToastProps } from './toast';
import { Toast, TRANSITION_DURATION } from './toast';

export type ToastContextData = null | ((toast: ToastProps) => void);

export const ToastContext = React.createContext<ToastContextData>(null);
export const ToastWrapper: FC<{ children: ReactNode }> = (props) => {
  // spread operators on arrays are to fix this
  // https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
  const [toasts, setToasts] = useState<(ToastProps & { id: string; timer: NodeJS.Timeout })[]>([]);
  const createToast = useCallback(
    (toast: ToastProps) => {
      if (toasts.some((existing) => existing.text === toast.text)) {
        // skip duplicate cards
        return;
      }

      const timeout = toast.timeout ?? 5000;
      const id = nanoid(10);
      const timer = setTimeout(() => {
        // set removing on toast
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
    [toasts, setToasts]
  );

  return (
    <ToastContext.Provider value={createToast}>
      {props.children}
      <div className="fixed flex justify-end bottom-5 right-5 left-5">
        {toasts.map((toast) => (
          <Toast key={toast.id} removing={toast.removing} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
