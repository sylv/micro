import { DateTime } from "luxon";
import { FunctionComponent, useEffect, useMemo, useState } from "react";

export interface TimeProps {
  date: string | number | Date;
  className?: string;
}

export const Time: FunctionComponent<TimeProps> = (props) => {
  const date = useMemo(() => new Date(props.date), [props.date]);
  const time = useMemo(() => DateTime.fromJSDate(date), [date]);
  const [relative, setRelative] = useState(time.toRelative());
  const iso = date.toISOString();

  useEffect(() => {
    const timer = setInterval(() => {
      setRelative(time.toRelative());
    }, 60_000);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <time dateTime={iso} className={props.className}>
      {relative}
    </time>
  );
};
