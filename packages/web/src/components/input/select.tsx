import classNames from "classnames";
import React, { SelectHTMLAttributes } from "react";
import { ChevronDown } from "react-feather";
import { inputClasses, InputContainer } from "./input-container";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { prefix, suffix, className, children, ...rest },
  ref
) {
  const classes = classNames(className, inputClasses, "appearance-none pr-8");

  return (
    <InputContainer prefix={prefix} suffix={suffix} className={className}>
      <div className="relative inline-flex w-full select-none h-full">
        <select className={classes} ref={ref} {...rest}>
          {children}
        </select>
        <div className="absolute right-0 flex items-center justify-center w-10 h-full text-gray-500 pointer-events-none">
          <ChevronDown size="1em" className="stroke-current" />
        </div>
      </div>
    </InputContainer>
  );
});
