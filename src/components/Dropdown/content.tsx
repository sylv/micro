import classNames from "classnames";
import { FunctionComponent } from "react";

export interface DropdownContent {
  left?: boolean;
  middle?: boolean;
  matchWidth?: boolean;
  wrapper?: React.RefObject<HTMLDivElement>; // via index.tsx
}

export const DropdownContent: FunctionComponent<DropdownContent> = (props) => {
  const useOffset = props.left || props.middle;
  const offset = props.wrapper!.current?.clientWidth;
  const marginLeft = useOffset ? `${props.middle ? (offset ?? 0) / 2 : offset}px` : undefined;
  const width = props.matchWidth ? props.wrapper!.current?.clientWidth : undefined;
  const classes = classNames(
    "absolute z-50 flex flex-col mt-2 transform bg-black border rounded border-dark-500 w-44",
    {
      "-translate-x-full": props.left,
      "-translate-x-2/4": props.middle,
    }
  );

  return (
    <div className={classes} style={{ marginLeft, width }} role="menu">
      {props.children}
    </div>
  );
};
