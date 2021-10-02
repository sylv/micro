import NextLink from "next/link";
import { FunctionComponent, HTMLAttributes } from "react";

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const Link: FunctionComponent<LinkProps> = ({ href, children, ...rest }) => {
  return (
    <NextLink href={href} passHref>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};
