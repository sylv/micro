/* eslint-disable react/button-has-type */
import classNames from "classnames";
import { forwardRef, HTMLAttributes } from "react";
import { Link } from "../link";
import style from "./button.module.css";

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, "prefix"> {
  href?: string;
  disabled?: boolean;
  primary?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  small?: boolean;
  type?: "submit" | "reset" | "button";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, disabled, prefix, suffix, className, primary, small, onClick, onKeyDown, type, children, ...rest }, ref) => {
    const onClickWrap = disabled ? undefined : onClick;
    const onKeyDownWrap = disabled ? undefined : onKeyDown;
    const classes = classNames(className, style.button, {
      [style.disabled]: disabled,
      [style.primary]: primary,
      [style.small]: small,
    });

    if (href) {
      if (ref) {
        throw new Error("Button cannot have ref and href");
      }

      return (
        <Link href={href} className={classes} onClick={onClickWrap} onKeyDown={onKeyDownWrap} {...rest}>
          {prefix && <span className={style.prefix}>{prefix}</span>}
          <span className={style.content}>{children}</span>
          {suffix && <span className={style.suffix}>{suffix}</span>}
        </Link>
      );
    }

    return (
      <button type={type} className={classes} disabled={disabled} onClick={onClickWrap} onKeyDown={onKeyDownWrap} {...rest} ref={ref}>
        {prefix && <span className={style.prefix}>{prefix}</span>}
        <span className={style.content}>{children}</span>
        {suffix && <span className={style.suffix}>{suffix}</span>}
      </button>
    );
  }
);
