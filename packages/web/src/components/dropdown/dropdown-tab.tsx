import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';
import { Link } from '../link';

export interface DropdownTabProps {
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const DropdownTab: FC<DropdownTabProps> = ({ href, className, children, onClick }) => {
  const props = href ? { as: Link, href: href } : { as: Fragment };
  const base = classNames('px-3 py-2 my-1 text-gray-400 transition ease-in-out border-none cursor-pointer', className);

  return (
    <Menu.Item {...(props as any)}>
      {({ active }) => (
        <div className={classNames(base, active && 'text-white bg-dark-800')} onClick={onClick}>
          {children}
        </div>
      )}
    </Menu.Item>
  );
};
