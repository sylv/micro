import clsx from "clsx";
import type { FC } from "react";
import { Fragment } from "react";
import { Ping } from "./ping";

interface StepsProps {
  steps: string[];
  stepIndex: number;
}

export const Steps: FC<StepsProps> = ({ steps, stepIndex }) => {
  return (
    <div className="flex justify-center items-center text-sm">
      {steps.map((step, index) => {
        const isActive = index === stepIndex;
        return (
          <Fragment key={step}>
            {index !== 0 && <div className="h-px w-8 mx-4 bg-gray-800" />}
            <div className="flex items-center gap-2">
              <Ping active={isActive} />
              <div className={clsx(!isActive && "text-gray-400")}>{step}</div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};
