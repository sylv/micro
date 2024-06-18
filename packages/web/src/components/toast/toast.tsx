import { clsx } from "clsx";
import { memo, type ReactNode, useEffect, useState } from "react";
import { FiInfo, FiX } from "react-icons/fi";
import { Button, ButtonStyle } from "../button";
import { removeToast, updateToast } from "./store";
import { motion } from "framer-motion";

export interface ToastProps {
  id: number;
  message: ReactNode;
  className?: string;
  removing: boolean;
  expiresAt: number | null;
  createdAt: number;
  paused?: boolean;
  style?: ToastStyle;
  onConfirm?: () => void;
  onCancel?: () => void;
  onRemove: () => void;
}

export enum ToastStyle {
  Default = 0,
  Error = 1,
}

export const Toast = memo<ToastProps>(
  ({
    id,
    removing,
    message,
    paused,
    expiresAt,
    createdAt,
    style = ToastStyle.Default,
    onRemove,
    onCancel: onCancelHandler,
    onConfirm: onConfirmHandler,
  }) => {
    const hasButtons = !!(onCancelHandler || onConfirmHandler);
    const [expiryProgress, setExpiryProgress] = useState<number | null>(null);
    const [pausedWith, setPausedWith] = useState<number | null>(null);
    const duration = expiresAt ? expiresAt - createdAt : null;
    const classes = clsx(
      "p-2 rounded flex gap-2 relative text-sm items-center overflow-hidden md:max-w-[40em]",
      style === ToastStyle.Default && "bg-purple-600",
      style === ToastStyle.Error && "bg-red-600",
    );
    const progressClasses = clsx(
      "absolute bottom-0 left-0 h-[2px] bg-brand-pink-400",
      style === ToastStyle.Default && "bg-purple-400",
      style === ToastStyle.Error && "bg-red-400",
    );

    const onCancel = () => {
      onRemove();
      onCancelHandler && onCancelHandler();
    };

    const onConfirm = () => {
      onRemove();
      onConfirmHandler && onConfirmHandler();
    };

    useEffect(() => {
      if (!expiresAt) return;
      if (paused && !pausedWith) {
        // when paused becomes true, we store the time we paused at
        // so we can resume later on
        const pausedWith = expiresAt - Date.now();
        setPausedWith(pausedWith);
      } else if (pausedWith) {
        // when paused changes to false, we reset the expiry and createdAt
        // to "resume" the expiry countdown
        setPausedWith(null);
        if (duration) {
          const newExpiresAt = Date.now() + pausedWith;
          updateToast(id, {
            expiresAt: newExpiresAt,
            createdAt: newExpiresAt - duration,
          });
        }
      }
    }, [paused]);

    useEffect(() => {
      if (expiresAt && !pausedWith) {
        const interval = setInterval(() => {
          const expiresIn = expiresAt - Date.now();
          const progress = 1 - expiresIn / (expiresAt - createdAt);
          setExpiryProgress(progress);
          if (progress >= 1) {
            removeToast(id);
            clearInterval(interval);
          }
        }, 3);

        return () => clearInterval(interval);
      }
    }, [pausedWith]);

    return (
      //   <Transition
      //     show={!removing}
      //     appear={true}
      //     enter="transition ease-out duration-200"
      //     enterFrom="opacity-0 translate-y-1"
      //     enterTo="opacity-100 translate-y-0"
      //     leave="transition ease-in duration-150"
      //     leaveFrom="opacity-100 translate-y-0"
      //     leaveTo="opacity-0 translate-y-1"
      //   >

      <motion.div
        initial="hidden"
        animate={removing ? "hidden" : "visible"}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <div className={classes}>
          <FiInfo className="w-4 h-4 shrink-0 stroke-white" />
          {!hasButtons && (
            <FiX className="absolute right-0 top-0 pt-2 pr-2 h-5 w-5 cursor-pointer" onClick={onRemove} />
          )}
          <div>{message}</div>
          <div className="ml-auto flex gap-2">
            {hasButtons && (
              <Button style={ButtonStyle.Transparent} onClick={onCancel}>
                Cancel
              </Button>
            )}
            {onConfirmHandler && (
              <Button style={ButtonStyle.Primary} onClick={onConfirm}>
                Confirm
              </Button>
            )}
          </div>
          {!!expiryProgress && (
            <div
              className={progressClasses}
              style={{
                right: `${Math.max(Math.min(expiryProgress * 100, 100), 0)}%`,
              }}
            />
          )}
        </div>
      </motion.div>
    );
  },
);
