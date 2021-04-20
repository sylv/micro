import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";
import { Link } from "../Link";
import style from "./index.module.css";

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "prefix"> {
  href?: string;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  type?: "primary" | "secondary";
  size?: "mini";
  rounded?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  href,
  disabled,
  prefix,
  suffix,
  type = "secondary",
  size,
  rounded,
  className,
  onClick,
  onKeyDown,
  children,
  ...rest
}) => {
  const onClickWrap = disabled ? undefined : onClick;
  const onKeyDownWrap = disabled ? undefined : onKeyDown;
  const classes = classNames(className, style.button, {
    [style.disabled]: disabled,
    [style.primary]: type === "primary",
    [style.secondary]: type === "secondary",
    [style.sizeMini]: size === "mini",
    [style.round]: rounded,
  });

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClickWrap} onKeyDown={onKeyDownWrap} {...rest}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span className={style.content}>{children}</span>
        {suffix && <span className={style.suffix}>{suffix}</span>}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClickWrap} onKeyDown={onKeyDownWrap} {...rest}>
      {prefix && <span className={style.prefix}>{prefix}</span>}
      <span className={style.content}>{children}</span>
      {suffix && <span className={style.suffix}>{suffix}</span>}
    </button>
  );
};
