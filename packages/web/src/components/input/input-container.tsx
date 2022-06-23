import classNames from 'classnames';
import type { FC, HTMLAttributes } from 'react';

export interface InputContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'prefix'> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const inputClasses =
  'w-full h-full px-4 py-2 text-sm text-left placeholder-gray-600 transition ease-in-out bg-dark-300 focus:outline-none focus:ring-gray-100 focus:bg-dark-600';

export const InputContainer: FC<InputContainerProps> = ({ className, prefix, suffix, children, ...rest }) => {
  const affixClasses =
    'flex items-center justify-center shrink-0 h-full px-3 text-sm text-gray-600 select-none bg-dark-300 border-dark-900';
  const classes = classNames(
    className,
    'flex items-center w-full overflow-hidden border rounded border-dark-600',
    'disabled:text-gray-600 disabled:bg-dark-300'
  );

  const prefixClasses = classNames(affixClasses, 'border-r');
  const suffixClasses = classNames(affixClasses, 'border-l');

  return (
    <div className={classes} style={{ height: '2.5rem' }} {...rest}>
      {prefix && <span className={prefixClasses}>{prefix}</span>}
      {children}
      {suffix && <span className={suffixClasses}>{suffix}</span>}
    </div>
  );
};
