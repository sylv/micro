import classNames from "classnames";
import { FunctionComponent, InputHTMLAttributes } from "react";
import style from "./index.module.css";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input: FunctionComponent<InputProps> = (props) => {
  const classes = classNames(style.input, {
    "rounded-l": !props.prefix,
    "rounded-r": !props.suffix,
  });

  return (
    <div className={classNames(style.container, props.className)}>
      {props.prefix && <span className={style.prefix}>{props.prefix}</span>}
      <input {...props} prefix={undefined} className={classes} />
      {props.suffix && <span className={style.suffix}>{props.suffix}</span>}
    </div>
  );
};
