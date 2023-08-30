import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';
import React from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

export interface TextAreaProps extends InputChildProps<TextareaHTMLAttributes<HTMLTextAreaElement>> {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...delegated }, ref) => {
  return (
    <InputContainer className={className} maxHeight={false} childProps={delegated}>
      {({ childClasses, ...rest }) => {
        const classes = clsx(childClasses, 'h-[50vh]');
        return <textarea {...rest} className={classes} ref={ref} />;
      }}
    </InputContainer>
  );
});
