import { useContext } from "react";
import { ToastContext } from "../components/toast/toast-wrapper";

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context.setToast) throw new Error('"ToastContext.Provider" must be used before "useToasts"');
  return context.setToast;
};
