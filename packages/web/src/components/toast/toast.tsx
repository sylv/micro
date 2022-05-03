import classNames from "classnames";
import { FC, useEffect, useState } from "react";

export interface ToastProps {
  text: string;
  error?: boolean;
  timeout?: number;
  removing?: boolean;
}

export const TRANSITION_DURATION = 300;
export const Toast: FC<ToastProps> = (props) => {
  const initialClasses = "opacity-0 scale-90";
  const animateClasses = "opacity-100 translate-x-0";
  const [transition, setTransition] = useState(initialClasses);
  const classes = classNames("p-4 transition duration-300 rounded shadow-xl select-none w-96", transition, {
    "bg-violet-500": !props.error,
    "bg-red-600": props.error,
  });

  useEffect(() => {
    if (props.removing) setTransition(initialClasses);
    else {
      // breaks the browser trying to optimise the transition by skipping it because we add it so fast
      requestAnimationFrame(() => {
        setTimeout(() => setTransition(animateClasses));
      });
    }
  }, [props.removing]);

  return <div className={classes}>{props.text}</div>;
};
