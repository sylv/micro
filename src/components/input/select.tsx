import classNames from "classnames";
import React, { SelectHTMLAttributes } from "react";
import { ChevronDown } from "react-feather";
import { InputContainer } from "./input-container";
import style from "./input.module.css";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  return (
    <InputContainer prefix={props.prefix} suffix={props.suffix} className={props.className}>
      <div className="relative inline-flex w-full select-none">
        <select {...props} prefix={undefined} className={classNames(props.className, style.input, "appearance-none")} ref={ref}>
          {props.children}
        </select>
        <div className="absolute right-0 flex items-center justify-center w-10 h-full text-gray-500 pointer-events-none disabled:">
          <ChevronDown size="1em" className="stroke-current" />
        </div>
      </div>
    </InputContainer>
  );
});
