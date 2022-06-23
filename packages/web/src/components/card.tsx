import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

export const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => {
  const classes = classNames(className, 'p-4 bg-dark-200 rounded');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
