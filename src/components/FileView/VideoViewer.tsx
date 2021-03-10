import { EMBEDDABLE_VIDEO_TYPES } from "../../constants";
import { GetFileData } from "../../types";

export function checkVideoSupport(file: GetFileData) {
  return EMBEDDABLE_VIDEO_TYPES.includes(file.type);
}

export const VideoViewer = (props: { file: GetFileData }) => {
  return (
    <video controls>
      <source src={props.file.urls.direct} type={props.file.type} />
    </video>
  );
};
