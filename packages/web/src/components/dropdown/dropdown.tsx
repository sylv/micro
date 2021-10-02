import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { Fragment, FunctionComponent } from "react";
import style from "./dropdown.module.css";

export interface DropdownProps {
  trigger: React.ReactChild;
  children: React.ReactNode;
  className?: string;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({ trigger, children, className }) => {
  const classes = classNames(className, style.dropdownItems);

  // todo: "z-10" is a hack that also makes the button z-10 which is stupid
  // but if its just applied to Menu.Items the transition (im assuming) transitions it
  // and it shows behind content for a second before popping to the front and is really jarring.
  // for now, this is a reasonable fix because i cba spending 6 hours finding the cause of it.
  return (
    <Menu as="div" className={style.dropdown}>
      {({ open }) => (
        <>
          <Menu.Button as={Fragment}>{trigger}</Menu.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className={classes} static>
              {children}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
