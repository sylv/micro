import type { FC } from "react";
import type { IconType } from "react-icons/lib";

interface MissingPreviewProps {
  icon: IconType;
  text: string;
  type: string;
}

export const MissingPreview: FC<MissingPreviewProps> = ({ icon: Icon, type, text }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Icon className="h-5 w-5 text-gray-500 mb-2" />
      <span className="text-gray-400">{text}</span>
      <span className="text-sm text-gray-600 text-center">{type}</span>
    </div>
  );
};
