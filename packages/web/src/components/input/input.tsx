import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { InputContainer } from "./input-container";
import style from "./input.module.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ prefix, suffix, className, ...rest }, ref) => {
  const classes = classNames(style.input, {
    "rounded-l": !prefix,
    "rounded-r": !suffix,
  });

  return (
    <InputContainer prefix={prefix} suffix={suffix} className={className}>
      <input {...rest} className={classes} ref={ref} />
    </InputContainer>
  );
});
