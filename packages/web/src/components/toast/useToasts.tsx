import { useContext } from 'react';
import { ToastContext } from './context';

export const useToasts = () => {
  const createToast = useContext(ToastContext);
  if (!createToast) {
    if (typeof window === 'undefined') return () => {};
    throw new Error('useToasts must be used within a ToastProvider');
  }

  return createToast;
};
