import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";

export const Card: FunctionComponent<HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div {...props} className={classNames("p-4 bg-black border rounded border-dark-600", props.className)}>
      {props.children}
    </div>
  );
};
