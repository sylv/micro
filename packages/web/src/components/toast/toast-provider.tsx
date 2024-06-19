import { useState } from "react";
import { useToasts } from "./store";
import { Toast } from "./toast";

export const ToastProvider = () => {
  const toasts = useToasts();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto sm:ml-4 min-w-[20em] space-y-2 z-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} paused={hovered} />
      ))}
    </div>
  );
};
