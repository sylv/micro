import classNames from 'classnames';
import type { FC, ReactNode } from 'react';

export const Section: FC<{ className?: string; children: ReactNode }> = ({ className, children }) => {
  const classes = classNames('absolute left-0 right-0 py-8 bg-black shadow-lg', className);
  return <section className={classes}>{children}</section>;
};
