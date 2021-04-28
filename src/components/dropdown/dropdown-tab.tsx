import { Menu } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, FunctionComponent } from "react";
import { Link } from "../link";
import style from "./dropdown.module.css";

export interface DropdownTabProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

export const DropdownTab: FunctionComponent<DropdownTabProps> = ({ href, className, children, onClick }) => {
  const props = href ? { as: Link, href: href } : { as: Fragment };
  const base = classNames(style.dropdownItem, className);

  return (
    <Menu.Item {...(props as any)}>
      {({ active }) => (
        <div className={classNames(base, active && style.dropdownItemActive)} onClick={onClick}>
          {children}
        </div>
      )}
    </Menu.Item>
  );
};
