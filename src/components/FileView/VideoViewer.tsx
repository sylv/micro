import { FunctionComponent } from "react";
import { EMBEDDABLE_VIDEO_TYPES } from "../../constants";
import { GetFileData } from "../../types";

export const checkVideoSupport = (file: GetFileData) => {
  return EMBEDDABLE_VIDEO_TYPES.includes(file.type);
};

export const VideoViewer: FunctionComponent<{ file: GetFileData }> = (props) => {
  return (
    <div className="flex items-center justify-center">
      <video controls className="outline-none">
        <source src={props.file.urls.direct} type={props.file.type} />
      </video>
    </div>
  );
};
