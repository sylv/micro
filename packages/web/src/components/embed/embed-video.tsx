import type { Embeddable } from "./embeddable";

export const EmbedVideo = ({ file }: { file: Embeddable }) => {
  return (
    <video controls loop playsInline className="h-full outline-none" height={file.height} width={file.width}>
      <source src={file.paths.direct} type={file.type} />
    </video>
  );
};

EmbedVideo.embeddable = (data: Embeddable) => {
  switch (data.type) {
    case "video/mp4":
    case "video/webm":
    case "video/ogg":
      return true;
    default:
      return false;
  }
};
