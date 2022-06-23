import { useEffect } from 'react';

export function useOnClickOutside(ref: React.MutableRefObject<any>, handler: () => void) {
  useEffect(() => {
    const onClick = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };

    const onKeyPress = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      handler();
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    document.addEventListener('keydown', onKeyPress);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
      document.removeEventListener('keydown', onKeyPress);
    };
  }, [ref, handler]);
}
