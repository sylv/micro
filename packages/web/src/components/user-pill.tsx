import classNames from "classnames";
import { FunctionComponent, HTMLAttributes } from "react";
import { Avatar } from "./avatar/avatar";

export interface UserPillProps extends HTMLAttributes<HTMLDivElement> {
  userId: string;
  username: string;
}

export const UserPill: FunctionComponent<UserPillProps> = ({ userId: id, username, className, ...rest }) => {
  const classes = classNames(
    "flex items-center px-2 py-1 transition rounded-full shadow-lg cursor-pointer select-none align-center bg-dark-600 hover:bg-dark-900 hover:text-white",
    className
  );

  return (
    <div className={classes} {...rest}>
      <span className="ml-1 mr-2 text-lg text-gray-400">{username}</span>
      <Avatar userId={id} className="w-6 h-6" />
    </div>
  );
};
