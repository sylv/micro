import { Menu } from "@headlessui/react";
import classNames from "classnames";
import { FunctionComponent } from "react";
import { Link } from "../link";

export interface DropdownTabProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

export const DropdownTab: FunctionComponent<DropdownTabProps> = ({ href, className, onClick, children }) => {
  const base = "px-3 py-2 my-1 transition ease-in-out border-none text-gray-400 cursor-pointer hover:bg-dark-700 hover:text-white";
  const classes = classNames(base, className);

  if (href) {
    return (
      <Menu.Item as={Link} href={href} onClick={onClick}>
        <div className={classes}>{children}</div>
      </Menu.Item>
    );
  }

  return (
    <Menu.Item as="div" className={classes} onClick={onClick}>
      {children}
    </Menu.Item>
  );
};
