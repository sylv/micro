import type { FC, ReactNode } from "react";

interface CustomisationOptionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const CustomisationOption: FC<CustomisationOptionProps> = ({ title, description, children }) => {
  return (
    <div className="flex items-center justify-between gap-4 bg-dark-100 p-3 rounded">
      <div>
        <div>{title}</div>
        <div className="text-gray-500 text-sm">{description}</div>
      </div>
      <div>{children}</div>
    </div>
  );
};
