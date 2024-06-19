import clsx from "clsx";
import type { ComponentProps, FC } from "react";
import type { InputChildProps } from "./container";
import { InputContainer } from "./container";

type TextAreaBaseProps = InputChildProps<ComponentProps<"textarea">>;

interface TextAreaProps extends TextAreaBaseProps {
  className?: string;
}

export const TextArea: FC<TextAreaProps> = ({ className, ...delegated }) => {
  return (
    <InputContainer className={className} maxHeight={false} childProps={delegated}>
      {({ childClasses, ...rest }) => {
        const classes = clsx(childClasses, "h-[50vh]");
        return <textarea {...rest} className={classes} />;
      }}
    </InputContainer>
  );
};
