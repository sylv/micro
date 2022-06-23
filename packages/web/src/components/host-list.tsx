import { Listbox } from "@headlessui/react";
import classNames from "classnames";
import type { FC} from "react";
import { Fragment, useRef, useState } from "react";
import { Check, ChevronDown } from "react-feather";
import { inputClasses, InputContainer } from "./input/input-container";

export interface HostListProps {
  hosts: string[];
  username: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange: (values: string[]) => void;
}

// todo: this is kind of hacked together until
// https://github.com/tailwindlabs/headlessui/pull/648 is merged
export const HostList: FC<HostListProps> = (props) => {
  const [selectedHosts, setSelectedHosts] = useState<string[]>([props.hosts[0]]);
  const reference = useRef<HTMLDivElement>(null);

  const onChange = (selected: string[]) => {
    setSelectedHosts(selected);
  };

  return (
    <div ref={reference} className="relative z-10">
      <Listbox as={Fragment} value={selectedHosts} multiple onChange={onChange}>
        <Listbox.Button as={Fragment}>
          <InputContainer className="cursor-pointer" prefix={props.prefix} suffix={props.suffix}>
            <div className={classNames(inputClasses, "flex items-center justify-between select-none overflow-hidden")}>
              <span className="truncate">{selectedHosts.join(", ")}</span>
              <ChevronDown className="text-gray-300" />
            </div>
          </InputContainer>
        </Listbox.Button>
        <Listbox.Options className="absolute right-0 mt-2 overflow-y-auto rounded-md shadow-2xl bg-dark-300 focus:outline-none max-h-56 min-w-[10em] w-full overflow-y-auto">
          {props.hosts.map((host) => (
            <Listbox.Option
              key={host}
              value={host}
              className={({ active, selected }) =>
                classNames(`select-none px-2 py-1 text-gray-500`, selected && "!text-gray-300", active && "bg-dark-600")
              }
            >
              {({ selected }) => (
                <span className="flex items-center gap-2">
                  {host.replace("{{username}}", props.username)}{" "}
                  {selected && <Check className="text-purple-400 h-4 w-4" />}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};
