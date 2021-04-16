import React, { FunctionComponent, useState } from "react";
import { Toast, ToastProps, TRANSITION_DURATION } from "./Toast";
import { nanoid } from "nanoid";

export interface ToastContextData {
  setToast?: (toast: ToastProps) => void;
}

export const ToastContext = React.createContext<ToastContextData>({});
export const ToastWrapper: FunctionComponent = (props) => {
  // spread operators on arrays are to fix this
  // https://stackoverflow.com/questions/56266575/why-is-usestate-not-triggering-re-render
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string; timer: NodeJS.Timeout }>>([]);
  const setToast = (toast: ToastProps) => {
    if (toasts.find((existing) => existing.text === toast.text)) {
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
  };

  return (
    <ToastContext.Provider value={{ setToast }}>
      {props.children}
      <div id="toasts-wrapper" className="absolute bottom-0 right-0 z-50 p-8 overflow-hidden">
        {toasts.map((toast) => (
          <Toast key={toast.id} removing={toast.removing} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
