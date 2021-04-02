import classNames from "classnames";
import { FunctionComponent, HTMLAttributes, KeyboardEventHandler, MouseEventHandler } from "react";
import { Link } from "../Link";
import style from "./index.module.css";

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "prefix"> {
  href?: string;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: "primary" | "secondary";
  size?: "mini";
}

export const Button: FunctionComponent<ButtonProps> = (props) => {
  const type = props.type ?? "secondary";
  const onClick = props.disabled ? undefined : props.onClick;
  const onKeyDown = props.disabled ? undefined : props.onKeyDown;
  const classes = classNames(props.className, style.button, {
    [style.disabled]: props.disabled,
    [style.primary]: type === "primary",
    [style.secondary]: type === "secondary",
    [style["size-mini"]]: props.size === "mini",
  });

  if (props.href) {
    return (
      <Link href={props.href} className={classes} onClick={onClick} onKeyDown={onKeyDown}>
        {props.prefix && <span className={style.prefix}>{props.prefix}</span>}
        <span className={style.content}>{props.children}</span>
        {props.suffix && <span className={style.suffix}>{props.suffix}</span>}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={props.disabled} onClick={onClick} onKeyDown={onKeyDown}>
      {props.prefix && <span className={style.prefix}>{props.prefix}</span>}
      <span className={style.content}>{props.children}</span>
      {props.suffix && <span className={style.suffix}>{props.suffix}</span>}
    </button>
  );
};
