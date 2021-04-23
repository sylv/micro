import classNames from "classnames";
import { FunctionComponent } from "react";

export const Section: FunctionComponent<{ className?: string }> = ({ className, children }) => {
  return <section className={classNames("bg-black shadow-lg right-0 left-0 py-8", className)}>{children}</section>;
};
