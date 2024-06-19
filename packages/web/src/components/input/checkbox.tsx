import type { ComponentProps, FC } from "react";
import type { InputChildProps } from "./container";
import { InputContainer } from "./container";

type CheckboxBaseProps = InputChildProps<ComponentProps<"input">>;

interface CheckboxProps extends CheckboxBaseProps {
  className?: string;
}

export const Checkbox: FC<CheckboxProps> = ({ className, ...delegated }) => {
  return (
    <InputContainer className={className} childProps={delegated}>
      {({ childClasses, ...rest }) => <input {...rest} type="checkbox" />}
    </InputContainer>
  );
};
