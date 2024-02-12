import clsx from 'clsx';
import type { ComponentProps } from 'react';
import React from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

type TextAreaBaseProps = InputChildProps<ComponentProps<'textarea'>>;

export interface TextAreaProps extends TextAreaBaseProps {
  className?: string;
}

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
