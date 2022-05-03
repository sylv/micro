/* eslint-disable react/button-has-type */
import classNames from "classnames";
import { forwardRef, HTMLAttributes } from "react";
import { Link } from "../link";

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
    const classes = classNames(
      "flex items-center justify-center w-full px-3 py-2 text-sm font-medium transition border rounded bg-dark-300 hover:bg-dark-600 border-dark-600 max-w-[15em]",
      disabled && "!bg-dark-200 border border-dark-600 text-white cursor-not-allowed",
      primary && "bg-brand hover:bg-brand hover:opacity-75",
      small && "text-xs font-normal px-2 py-1",
      className
    );

    if (href) {
      if (ref) {
        throw new Error("Button cannot have ref and href");
      }

      return (
        <Link href={href} className={classes} onClick={onClickWrap} onKeyDown={onKeyDownWrap} {...rest}>
          {prefix && <span className="mr-1">{prefix}</span>}
          <span className="truncate">{children}</span>
          {suffix && <span className={"ml-1"}>{suffix}</span>}
        </Link>
      );
    }

    return (
      <button
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClickWrap}
        onKeyDown={onKeyDownWrap}
        style={{ height: "2.5rem" }}
        {...rest}
        ref={ref}
      >
        {prefix && <span className="mr-1">{prefix}</span>}
        <span className="truncate">{children}</span>
        {suffix && <span className={"ml-1"}>{suffix}</span>}
      </button>
    );
  }
);
