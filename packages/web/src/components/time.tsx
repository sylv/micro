import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import type { FC } from "react";
import { useMemo } from "react";

dayjs.extend(RelativeTime);
const TIMESTAMP_REGEX = /^\d{6,}$/u;

interface TimeProps {
  date: string | number | Date;
  className?: string;
}

export const Time: FC<TimeProps> = ({ date, className }) => {
  const instance = useMemo(() => {
    if (typeof date === "string" && TIMESTAMP_REGEX.test(date)) {
      return new Date(Number(date));
    }

    return new Date(date);
  }, [date]);

  const relative = dayjs().to(instance);
  const iso = instance.toISOString();

  return (
    <time dateTime={iso} className={className}>
      {relative}
    </time>
  );
};
