import { useContext } from "react";
import { ToastContext } from "./context";

export const useToasts = () => {
  const createToast = useContext(ToastContext);
  if (!createToast) {
    // todo: this should be an error, but it seems like it can be undefined.
    // maybe due to concurrent rendering? idk shit about fuck.
    return () => undefined;
  }

  return createToast;
};
