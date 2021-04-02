import { FunctionComponent, SelectHTMLAttributes } from "react";
import { ChevronDown } from "react-feather";

export const Select: FunctionComponent<SelectHTMLAttributes<HTMLSelectElement>> = (props) => {
  return (
    <div className="relative inline-flex w-full select-none">
      <select
        {...props}
        className="w-full h-full px-4 py-2 text-sm placeholder-gray-600 bg-black border rounded appearance-none border-dark-900 focus:outline-none focus:ring-gray-100 disabled:cursor-not-allowed disabled:bg-dark-100"
      >
        {props.children}
      </select>
      <div className="absolute right-0 flex items-center justify-center w-10 h-full text-gray-500 pointer-events-none disabled:">
        <ChevronDown size="1em" className="stroke-current" />
      </div>
    </div>
  );
};
