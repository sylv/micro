import classNames from "classnames";
import * as avatar from "generate-avatar";
import { FunctionComponent, useMemo } from "react";
import style from "./index.module.css";

export interface AvatarProps {
  id: string;
  className?: string;
}

export const Avatar: FunctionComponent<AvatarProps> = (props) => {
  const svg = useMemo(() => avatar.generateFromString(props.id), [props.id]);
  return (
    <div
      className={classNames(props.className, style.avatar, props.className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    ></div>
  );
};
