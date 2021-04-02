import { useEffect } from "react";

export function useOnClickOutside(ref: React.MutableRefObject<any>, handler: EventListener) {
  useEffect(() => {
    const listener: EventListener = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
