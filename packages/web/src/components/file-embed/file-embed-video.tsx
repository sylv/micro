import { GetFileData } from "@micro/api";

export const FileEmbedVideo = ({ file }: { file: GetFileData }) => {
  return (
    <video
      controls
      loop
      playsInline
      className="h-full outline-none"
      height={file.metadata?.height}
      width={file.metadata?.width}
    >
      <source src={file.paths.direct} type={file.type} />
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
