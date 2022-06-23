import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import type { FC } from 'react';
import { Fragment, useRef, useState } from 'react';
import { Check, ChevronDown } from 'react-feather';
import { inputClasses, InputContainer } from './input/input-container';

export interface HostListProps {
  hosts: string[];
  username: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onChange: (values: string[]) => void;
}

export const HostList: FC<HostListProps> = ({ hosts, username, prefix, suffix, onChange }) => {
  const reference = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const setItems = (items: string[]) => {
    onChange(items);
    setSelected(items);
  };

  return (
    <div ref={reference} className="relative z-10">
      <Listbox as={Fragment} value={selected} multiple onChange={setItems}>
        <Listbox.Button as={Fragment}>
          <InputContainer className="cursor-pointer" prefix={prefix} suffix={suffix}>
            <div className={classNames(inputClasses, 'flex items-center justify-between select-none overflow-hidden')}>
              <span className="truncate">{selected.join(', ')}</span>
              <ChevronDown className="text-gray-300" />
            </div>
          </InputContainer>
        </Listbox.Button>
        <Listbox.Options className="absolute right-0 mt-2 overflow-y-auto rounded-md shadow-2xl bg-dark-300 focus:outline-none max-h-56 min-w-[10em] w-full overflow-y-auto">
          {hosts.map((host) => (
            <Listbox.Option
              key={host}
              value={host}
              className={({ active, selected }) =>
                classNames(`select-none px-2 py-1 text-gray-500`, selected && '!text-gray-300', active && 'bg-dark-600')
              }
            >
              {({ selected }) => (
                <span className="flex items-center gap-2">
                  {host.replace('{{username}}', username)} {selected && <Check className="text-purple-400 h-4 w-4" />}
                </span>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};
