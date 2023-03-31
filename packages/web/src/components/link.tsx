import NextLink from 'next/link';
import type { FC, HTMLAttributes } from 'react';

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: FC<LinkProps> = ({ children, ...rest }) => {
  return <NextLink {...rest}>{children}</NextLink>;
};
