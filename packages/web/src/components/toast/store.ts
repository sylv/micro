import type { ReactNode } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ToastStyle, type ToastProps } from "./toast";

const TRANSITION_INTERVAL = 150;
let currentToastId = 0;

interface ToastOptions {
  id: number;
  message: ReactNode;
  className?: string;
  removing?: boolean;
  style?: ToastStyle;
  duration?: number | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

type State = {
  items: ToastProps[];
};

const useToastStore = create<State>()(
  immer((set) => ({
    items: [],
  })),
);

export const removeToast = (id: number) => {
  let hasToast: boolean | undefined;
  useToastStore.setState((draft) => {
    const toast = draft.items.find((toast) => toast.id === id);
    if (toast) {
      if (toast.removing) return;
      toast.removing = true;
      hasToast = true;
    }
  });

  if (hasToast) {
    setTimeout(() => {
      useToastStore.setState((draft) => {
        draft.items = draft.items.filter((item) => item.id !== id);
      });
    }, TRANSITION_INTERVAL);
  }
};

export const createToast = (options: Omit<ToastOptions, "id" | "removing">) => {
  if (typeof window === "undefined") return;
  const id = currentToastId++;
  const hasButtons = !!(options.onConfirm || options.onCancel);
  const timer: NodeJS.Timeout | undefined = undefined;
  const onRemove = () => {
    if (timer) clearTimeout(timer);
    removeToast(id);
    if (options.onClose) {
      options.onClose();
    }
  };

  const duration =
    options.duration === null ? options.duration : options.duration || (hasButtons ? 10000 : 5000);
  const expiresAt = duration === null ? null : Date.now() + duration;
  const toast: ToastProps = {
    ...options,
    id: id,
    removing: false,
    expiresAt: expiresAt,
    createdAt: Date.now(),
    onRemove,
  };

  useToastStore.setState((draft) => {
    const existingToast = draft.items.find((toast) => toast.message === options.message);
    if (existingToast) {
      console.debug(
        `Toast with message "${options.message}" already exists, refreshing time on existing toast.`,
      );
      existingToast.expiresAt = expiresAt;
      existingToast.createdAt = Date.now();
      return;
    }

    draft.items.push(toast);
  });

  return toast;
};

export const updateToast = (id: number, options: Partial<ToastProps>) => {
  useToastStore.setState((draft) => {
    const toast = draft.items.find((toast) => toast.id === id);
    if (toast) {
      Object.assign(toast, options);
    }
  });
};

export const useToasts = () => {
  return useToastStore((store) => store.items);
};
