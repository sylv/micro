import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";

export const Card: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => {
  return (
    <div className={classNames(className, "p-4 bg-dark-200 rounded")} {...rest}>
      {children}
    </div>
  );
};
