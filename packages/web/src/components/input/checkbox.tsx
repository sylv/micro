/* eslint-disable @typescript-eslint/no-unused-vars */
import type { InputHTMLAttributes } from 'react';
import React from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

export interface CheckboxProps extends InputChildProps<InputHTMLAttributes<HTMLInputElement>> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...delegated }, ref) => {
  return (
    <InputContainer className={className} childProps={delegated}>
      {({ childClasses, ...rest }) => <input {...rest} type="checkbox" ref={ref} />}
    </InputContainer>
  );
});
