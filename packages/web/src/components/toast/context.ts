import React from "react";
import { ToastProps } from "./toast";

export type ToastContextData = null | ((toast: ToastProps) => void);
export const ToastContext = React.createContext<ToastContextData>(null);
