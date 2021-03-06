import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";
import { Link } from "../link";
import style from "./button.module.css";

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "prefix"> {
  href?: string;
  disabled?: boolean;
  primary?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  small?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  href,
  disabled,
  prefix,
  suffix,
  className,
  primary,
  small,
  onClick,
  onKeyDown,
  children,
  ...rest
}) => {
  const onClickWrap = disabled ? undefined : onClick;
  const onKeyDownWrap = disabled ? undefined : onKeyDown;
  const classes = classNames(className, style.button, {
    [style.disabled]: disabled,
    [style.primary]: primary,
    [style.small]: small,
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
