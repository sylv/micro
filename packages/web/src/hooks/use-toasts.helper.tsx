import { useContext } from 'react';
import { ToastContext } from '../components/toast/toast-wrapper';

export const useToasts = () => {
  const setToast = useContext(ToastContext);
  if (!setToast) throw new Error('"ToastContext.Provider" must be used before "useToasts"');
  return setToast;
};
