/* eslint-disable react/button-has-type */
import classNames from 'classnames';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Link } from './link';

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'prefix' | 'style'> {
  href?: string;
  disabled?: boolean;
  style?: ButtonStyle;
  type?: 'submit' | 'reset' | 'button';
}

export enum ButtonStyle {
  Primary = 'bg-purple-500 hover:bg-purple-400',
  Secondary = 'bg-dark-600 hover:bg-dark-900',
  Disabled = 'bg-dark-300 hover:bg-dark-400',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, disabled, className, type, children, style = ButtonStyle.Primary, onClick, onKeyDown, ...rest }, ref) => {
    if (disabled) style = ButtonStyle.Disabled;
    const onClickWrap = disabled ? undefined : onClick;
    const onKeyDownWrap = disabled ? undefined : onKeyDown;
    const classes = classNames(
      'flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium transition rounded truncate max-h-[2.65em]',
      disabled && 'cursor-not-allowed',
      className,
      style
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