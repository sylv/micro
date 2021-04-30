import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, FunctionComponent, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import dropdownStyle from "./dropdown/dropdown.module.css";
import { InputContainer } from "./input/input-container";
import inputStyle from "./input/input.module.css";

export interface HostListProps {
  hosts: string[];
  username: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange: (values: string[]) => void;
}

// todo: this is kind of hacked together until
// https://github.com/tailwindlabs/headlessui/issues/181 is implemented
export const HostList: FunctionComponent<HostListProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([props.hosts[0]]);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = open ? ChevronUp : ChevronDown;

  useOnClickOutside(ref, () => setOpen(false));

  const isSelected = (value: string) => selectedHosts.includes(value);
  const onChange = (value: string) => {
    if (!isSelected(value)) {
      const withValue = [...selectedHosts, value];
      setSelectedHosts(withValue);
      props.onChange(withValue);
    } else {
      const withoutValue = selectedHosts.filter((host) => host !== value);
      setSelectedHosts(withoutValue);
      props.onChange(withoutValue);
    }
  };

  return (
    <div ref={ref} className={classNames(dropdownStyle.dropdown)}>
      <Listbox as={Fragment} value={selectedHosts as any} onChange={onChange}>
        <InputContainer className="cursor-pointer" onClick={() => setOpen(!open)} prefix={props.prefix} suffix={props.suffix}>
          <div className={classNames(inputStyle.input, "flex items-center justify-between select-none overflow-hidden")}>
            <span className="truncate">{selectedHosts.join(", ")}</span>
            <Icon className="text-gray-300" />
          </div>
        </InputContainer>
        {open && (
          <Listbox.Options className={classNames(dropdownStyle.dropdownItems, "w-full max-h-56 overflow-y-auto")} static>
            {props.hosts.map((host) => (
              <Listbox.Option as={Fragment} key={host} value={host}>
                {({ active }) => {
                  const highlight = active || isSelected(host);
                  const classes = classNames(dropdownStyle.dropdownItem, highlight && dropdownStyle.dropdownItemSelected, "select-none");
                  return <div className={classes}>{host.replace("{{username}}", props.username)}</div>;
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        )}
      </Listbox>
    </div>
  );
};
