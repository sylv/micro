import clsx from "clsx";
import * as avatar from "generate-avatar";
import type { FC } from "react";
import { useMemo, useRef } from "react";

export interface AvatarProps {
  userId: string;
  className?: string;
}

export const Avatar: FC<AvatarProps> = (props) => {
  const classes = clsx("overflow-hidden rounded-full select-none", props.className);
  const containerRef = useRef<HTMLDivElement>(null);
  const svg = useMemo(() => {
    const result = avatar.generateFromString(props.userId);
    return result.replaceAll(/(width|height)="(\d+)"/g, '$1="100%"');
  }, [props.userId]);

  return <div className={classes} dangerouslySetInnerHTML={{ __html: svg }} ref={containerRef} />;
};
