import { GetFileData } from "@micro/api";

export const FileEmbedVideo = ({ file }: { file: GetFileData }) => {
  return (
    <video controls loop playsInline className="h-full outline-none">
      <source src={file.urls.direct} type={file.type} />
    </video>
  );
};

FileEmbedVideo.embeddable = (file: GetFileData) => {
  switch (file.type) {
    case "video/mp4":
    case "video/webm":
    case "video/ogg":
      return true;
    default:
      return false;
  }
};
