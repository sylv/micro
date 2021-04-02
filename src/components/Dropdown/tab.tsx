import classNames from "classnames";
import { FunctionComponent, MouseEventHandler } from "react";
import { Link } from "../Link";

export interface DropdownTabProps {
  href?: string;
  tabIndex?: number;
  onClick?: MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
}

export const DropdownTab: FunctionComponent<DropdownTabProps> = (props) => {
  const style = classNames("px-4 py-3 my-1 transition duration-200 ease-in-out hover:bg-dark-400", {
    "cursor-pointer": props.onClick ?? props.href,
  });

  if (props.href) {
    return (
      <Link href={props.href} className={style} onClick={props.onClick} tabIndex={props.tabIndex}>
        {props.children}
      </Link>
    );
  }
  return (
    <div className={style} onClick={props.onClick} tabIndex={props.tabIndex}>
      {props.children}
    </div>
  );
};
