import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";

export const Card: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...rest }) => {
  const classes = classNames(className, "p-4 bg-dark-200 rounded");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
