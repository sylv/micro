import { GetFileData } from "@micro/api";

export const FileEmbedDefault = ({ file }: { file: GetFileData }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full select-none h-44">
      <h1 className="flex items-center mb-2 text-xl font-bold">{file.type}</h1>
      <span className="text-sm text-gray-500">No preview available for this file type.</span>
    </div>
  );
};
