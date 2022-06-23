/* eslint-disable react/button-has-type */
import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Link } from '../link';

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'prefix'> {
  href?: string;
  disabled?: boolean;
  primary?: boolean;
  small?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, disabled, className, primary, small, onClick, onKeyDown, type, children, ...rest }, ref) => {
    const onClickWrap = disabled ? undefined : onClick;
    const onKeyDownWrap = disabled ? undefined : onKeyDown;
    const classes = classNames(
      'flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium transition border rounded bg-dark-300 hover:bg-dark-600 border-dark-600 truncate',
      disabled && '!bg-dark-200 border border-dark-600 text-white cursor-not-allowed',
      primary && 'bg-brand hover:bg-brand hover:opacity-75',
      small && 'text-xs font-normal px-2 py-1',
      className
    );

    if (href) {
      if (ref) {
        throw new Error('Button cannot have ref and href');
      }

      return (
        <Link href={href} className={classes} onClick={onClickWrap} onKeyDown={onKeyDownWrap} {...rest}>
          {children}
        </Link>
      );
    }

    return (
      <button
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClickWrap}
        onKeyDown={onKeyDownWrap}
        style={{ height: '2.5rem' }}
        {...rest}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);
