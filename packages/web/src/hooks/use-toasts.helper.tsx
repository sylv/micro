import { useContext } from 'react';
import { ToastContext } from '../components/toast/toast-wrapper';

export const useToasts = () => {
  const setToast = useContext(ToastContext);
  if (!setToast) {
    // todo: this should be an error, but it seems like it can be undefined.
    // maybe due to concurrent rendering? idk shit about fuck.
    return () => undefined;
  }

  return setToast;
};
