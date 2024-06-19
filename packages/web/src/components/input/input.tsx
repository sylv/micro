import type { ComponentProps, FC } from "react";
import type { InputChildProps } from "./container";
import { InputContainer } from "./container";

interface InputProps extends InputChildProps<ComponentProps<"input">> {
  isError?: boolean;
  className?: string;
}

export const Input: FC<InputProps> = ({ className, isError, ...delegated }) => {
  return (
    <InputContainer className={className} childProps={delegated} isError={isError}>
      {({ childClasses, ...rest }) => <input {...rest} className={childClasses} />}
    </InputContainer>
  );
};
