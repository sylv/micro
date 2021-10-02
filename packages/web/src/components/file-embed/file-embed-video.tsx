import { EMBEDDABLE_VIDEO_TYPES } from "@micro/common";
import { GetFileData } from "@micro/api";

export const FileEmbedVideo = ({ file }: { file: GetFileData }) => {
  return (
    <video controls loop playsInline className="h-full outline-none">
      <source src={file.urls.direct} type={file.type} />
    </video>
  );
};

FileEmbedVideo.embeddable = (type: string) => EMBEDDABLE_VIDEO_TYPES.includes(type);
