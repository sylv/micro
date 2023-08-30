import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';
import React from 'react';
import { ChevronDown } from 'react-feather';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

export interface SelectProps extends InputChildProps<SelectHTMLAttributes<HTMLSelectElement>> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...delegated }, ref) => {
  return (
    <InputContainer className={className} childProps={delegated}>
      {({ childClasses, ...rest }) => {
        const classes = clsx(className, childClasses, 'appearance-none pr-8');
        return (
          <div className="relative select-none">
            <select className={classes} ref={ref} {...rest}>
              {children}
            </select>
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-gray-500 pointer-events-none">
              <ChevronDown size="1em" className="stroke-current" />
            </div>
          </div>
        );
      }}
    </InputContainer>
  );
});
