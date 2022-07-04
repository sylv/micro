import type { InputHTMLAttributes } from 'react';
import React from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

export interface InputProps extends InputChildProps<InputHTMLAttributes<HTMLInputElement>> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...delegated }, ref) => {
  return (
    <InputContainer className={className} childProps={delegated}>
      {({ childClasses, ...rest }) => <input {...rest} className={childClasses} ref={ref} />}
    </InputContainer>
  );
});
