import classNames from 'classnames';
import type { TextareaHTMLAttributes } from 'react';
import React from 'react';
import type { InputChildProps } from './container';
import { InputContainer } from './container';

export interface TextAreaProps extends InputChildProps<TextareaHTMLAttributes<HTMLTextAreaElement>> {}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...delegated }, ref) => {
  return (
    <InputContainer className={className} maxHeight={false} childProps={delegated}>
      {({ childClasses, ...rest }) => {
        const classes = classNames(childClasses, 'h-[40vh]');
        return <textarea {...rest} className={classes} ref={ref} />;
      }}
    </InputContainer>
  );
});
