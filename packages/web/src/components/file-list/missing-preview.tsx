import { FC } from "react";
import { Icon } from "react-feather";

export const MissingPreview: FC<{ icon: Icon; text: string; type: string }> = ({ icon: Icon, type, text }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Icon className="h-5 w-5 text-gray-500 mb-2" />
      <span className="text-gray-400">{text}</span>
      <span className="text-sm text-gray-600">{type}</span>
    </div>
  );
};
