import clsx from "clsx";
import type { ComponentProps, FC } from "react";

export const Card: FC<ComponentProps<"div">> = ({ className, children, ...rest }) => {
  const classes = clsx(className, "p-4 bg-dark-200 rounded");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
