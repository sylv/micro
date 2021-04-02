import React, { FunctionComponent, useRef, useState } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
export * from "./tab";

export interface DropdownProps {
  trigger: React.ReactChild;
  children: React.ReactNode;
}

export const Dropdown: FunctionComponent<DropdownProps> = (props) => {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const content = React.cloneElement(props.children as React.ReactElement<any>, {
    wrapper,
  });

  useOnClickOutside(wrapper, () => setOpen(false));

  return (
    <div className="relative" ref={wrapper} onClick={() => setOpen((state) => !state)}>
      {props.trigger}
      {open && content}
    </div>
  );
};
