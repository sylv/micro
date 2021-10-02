import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";
import style from "./input.module.css";

export interface InputContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const InputContainer: FunctionComponent<InputContainerProps> = ({ className, prefix, suffix, children, ...rest }) => {
  const classes = classNames(style.container, className);

  return (
    <div className={classes} style={{ height: "2.5rem" }} {...rest}>
      {prefix && <span className={style.prefix}>{prefix}</span>}
      {children}
      {suffix && <span className={style.suffix}>{suffix}</span>}
    </div>
  );
};
