import { Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import React, { FC, Fragment, ReactNode } from "react";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({ trigger, children, className }) => {
  const itemsClasses = classNames(
    "absolute right-0 mt-2 overflow-y-auto rounded-md shadow-2xl bg-dark-300 focus:outline-none max-h-56 min-w-[10em]",
    className
  );

  return (
    <Menu as="div" className="relative z-10">
      {({ open }) => (
        <>
          <Menu.Button as={Fragment}>{trigger}</Menu.Button>
          <Transition
            show={open}
            enter="ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className={itemsClasses} static>
              {children}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};
