import classNames from 'classnames';
import type { FC } from 'react';
import { ArrowLeft } from 'react-feather';
import { Link } from './link';

export const Breadcrumbs: FC<{ to: string; children: string; className?: string }> = ({ to, children, className }) => {
  const classes = classNames('text-sm text-gray-500 flex items-center gap-1 hover:underline', className);
  return (
    <Link href={to} className={classes}>
      <ArrowLeft className="h-4 w-4" /> {children}
    </Link>
  );
};
