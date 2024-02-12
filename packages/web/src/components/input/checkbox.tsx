/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ComponentProps } from 'react';
import React from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

type CheckboxBaseProps = InputChildProps<ComponentProps<'input'>>;

export interface CheckboxProps extends CheckboxBaseProps {
  className?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...delegated }, ref) => {
  return (
    <InputContainer className={className} childProps={delegated}>
      {({ childClasses, ...rest }) => <input {...rest} type="checkbox" ref={ref} />}
    </InputContainer>
  );
});
