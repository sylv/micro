import React, { ComponentProps } from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

export interface InputProps extends InputChildProps<ComponentProps<'input'>> {
  isError?: boolean;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, isError, ...delegated }, ref) => {
  return (
    <InputContainer className={className} childProps={delegated} isError={isError}>
      {({ childClasses, ...rest }) => <input {...rest} className={childClasses} ref={ref} />}
    </InputContainer>
  );
});
