import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";
import style from "./index.module.css";

export interface InputContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const InputContainer: FunctionComponent<InputContainerProps> = (props) => {
  const classes = classNames(style.container, props.className);

  return (
    <div className={classes} style={{ height: "2.5rem" }}>
      {props.prefix && <span className={style.prefix}>{props.prefix}</span>}
      {props.children}
      {props.suffix && <span className={style.suffix}>{props.suffix}</span>}
    </div>
  );
};
