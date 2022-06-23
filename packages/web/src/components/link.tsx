import NextLink from 'next/link';
import type { FC, HTMLAttributes } from 'react';

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: FC<LinkProps> = ({ href, children, ...rest }) => {
  return (
    <NextLink href={href} passHref>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};
