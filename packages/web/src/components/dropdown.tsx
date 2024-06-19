import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { useState, type FC, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface DropdownProps {
  trigger: ReactNode;
  align: "start" | "end" | "center";
  children: ReactNode;
  className?: string;
}

export const Dropdown: FC<DropdownProps> = ({ trigger, children, className, align }) => {
  const [isOpen, setOpen] = useState(false);
  const itemsClasses = clsx(
    "z-20 mt-2 overflow-y-auto rounded-md shadow-2xl bg-dark-300 focus:outline-none max-h-56 min-w-[10em]",
    className,
  );

  return (
    <DropdownMenu.Root modal={false} open={isOpen} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenu.Content forceMount className={itemsClasses} align={align} asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.1 }}
            >
              {children}
            </motion.div>
          </DropdownMenu.Content>
        )}
      </AnimatePresence>
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
  const As = href ? "a" : onClick ? "button" : "div";
  const base = clsx(
    "block w-full text-left px-3 py-2 my-1 text-gray-400 transition ease-in-out border-none cursor-pointer hover:bg-dark-800",
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
