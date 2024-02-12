import type { ComponentProps} from 'react';
import { forwardRef } from 'react';

export interface LinkProps extends ComponentProps<'a'> {
  href: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, ...rest }, ref) => {
  return (
    <a {...rest} ref={ref}>
      {children}
    </a>
  );
});
