import classNames from "classnames";
import * as avatar from "generate-avatar";
import { FunctionComponent, useMemo } from "react";
import style from "./avatar.module.css";

export interface AvatarProps {
  userId: string;
  className?: string;
}

export const Avatar: FunctionComponent<AvatarProps> = (props) => {
  const svg = useMemo(() => avatar.generateFromString(props.userId), [props.userId]);
  return <div className={classNames(props.className, style.avatar, props.className)} dangerouslySetInnerHTML={{ __html: svg }}></div>;
};
