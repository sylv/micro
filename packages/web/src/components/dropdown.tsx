import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { Link } from './link';

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({ trigger, children, className }) => {
  const itemsClasses = clsx(
    'absolute right-0 mt-2 overflow-y-auto rounded-md shadow-2xl bg-dark-300 focus:outline-none max-h-56 min-w-[10em]',
    className,
  );

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content className={itemsClasses}>{children}</DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export interface DropdownTabProps {
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const DropdownTab: FC<DropdownTabProps> = ({ href, className, children, onClick }) => {
  const As = href ? Link : onClick ? 'button' : 'div';
  const base = clsx(
    'block w-full text-left px-3 py-2 my-1 text-gray-400 transition ease-in-out border-none cursor-pointer hover:bg-dark-800',
    className,
  );

  return (
    <DropdownMenu.Item className="outline-none" asChild={!href}>
      <As href={href!} className={base} onClick={onClick}>
        {children}
      </As>
    </DropdownMenu.Item>
  );
};

export const DropdownDivider: FC = () => {
  return <hr className="w-full !border-none bg-dark-900 h-px" />;
};
