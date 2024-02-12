import clsx from 'clsx';
import type { FC, HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Spinner } from './spinner';

type ButtonBaseProps = Omit<
  HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
  'prefix' | 'style' | 'as' | 'loading'
>;

export interface ButtonProps extends ButtonBaseProps {
  href?: string;
  disabled?: boolean;
  style?: ButtonStyle;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button';
  as?: FC | 'button' | 'a';
}

export enum ButtonStyle {
  Primary = 'bg-purple-500 hover:bg-purple-400',
  Secondary = 'bg-dark-600 hover:bg-dark-900',
  Disabled = 'bg-dark-300 hover:bg-dark-400 cursor-not-allowed',
}

export const BASE_BUTTON_CLASSES =
  'flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition rounded truncate max-h-[2.65em]';

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      as: As = 'button',
      disabled,
      className,
      type,
      children,
      loading,
      style = ButtonStyle.Primary,
      onClick,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    if (disabled) style = ButtonStyle.Disabled;
    const onClickWrap = disabled || loading ? undefined : onClick;
    const onKeyDownWrap = disabled || loading ? undefined : onKeyDown;
    const classes = clsx(BASE_BUTTON_CLASSES, className, style);

    return (
      <As
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClickWrap}
        onKeyDown={onKeyDownWrap}
        style={{ height: '2.5rem' }}
        {...rest}
        ref={ref}
      >
        {children} {loading && <Spinner size="small" />}
      </As>
    );
  },
);
