import { forwardRef, type HTMLAttributes } from 'react';

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ children, ...rest }, ref) => {
  return (
    <a {...rest} ref={ref}>
      {children}
    </a>
  );
});
