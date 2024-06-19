import clsx from "clsx";
import type { FC, RefObject } from "react";
import { FiArrowLeft } from "react-icons/fi";

interface BreadcrumbsProps {
  href: string;
  children: string;
  ref?: RefObject<HTMLAnchorElement>;
  className?: string;
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ href, children, className, ref }) => {
  const classes = clsx("text-sm text-gray-500 flex items-center gap-1 hover:underline", className);
  return (
    <a href={href} className={classes} ref={ref}>
      <FiArrowLeft className="h-4 w-4" /> {children}
    </a>
  );
};
