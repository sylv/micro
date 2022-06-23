import classNames from 'classnames';
import type { InputHTMLAttributes } from 'react';
import React from 'react';
import { inputClasses, InputContainer } from './input-container';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ prefix, suffix, className, ...rest }, ref) => {
  const classes = classNames(inputClasses, {
    'rounded-l': !prefix,
    'rounded-r': !suffix,
  });

  return (
    <InputContainer prefix={prefix} suffix={suffix} className={className}>
      <input {...rest} className={classes} ref={ref} />
    </InputContainer>
  );
});
