import NextLink from "next/link";
import { FunctionComponent, HTMLAttributes } from "react";

export interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  tabIndex?: number;
  className?: string;
}

export const Link: FunctionComponent<LinkProps> = (props) => {
  return (
    <NextLink href={props.href} passHref>
      <a {...props}>{props.children}</a>
    </NextLink>
  );
};
