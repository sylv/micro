import type { FC } from "react";
import { Fragment } from "react";

interface PingProps {
  active: boolean;
}

export const Ping: FC<PingProps> = ({ active }) => {
  return (
    <div className="h-full flex relative items-center">
      {active && (
        <Fragment>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-400" />
        </Fragment>
      )}
      {!active && <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-600" />}
    </div>
  );
};
