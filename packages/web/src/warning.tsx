import classNames from 'classnames';
import { FC, ReactNode } from 'react';
import { Info } from 'react-feather';

export const Warning: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  const classes = classNames(
    'bg-purple-400 bg-opacity-40 border border-purple-400 px-2 py-1 rounded text-sm flex items-center gap-2',
    className
  );
  return (
    <div className={classes} role="alert">
      <Info className="text-purple-400 h-5 w-5" />
      {children}
    </div>
  );
};
