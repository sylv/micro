import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { InputContainer } from "./input-container";
import style from "./input.module.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const classes = classNames(style.input, {
    "rounded-l": !props.prefix,
    "rounded-r": !props.suffix,
  });

  return (
    <InputContainer prefix={props.prefix} suffix={props.suffix} className={props.className}>
      <input {...props} prefix={undefined} className={classes} ref={ref} />
    </InputContainer>
  );
});
