import copyToClipboard from "copy-to-clipboard";
import prettyBytes from "pretty-bytes";
import { FunctionComponent, useState } from "react";
import { Box, Clock, Download, FileText, Share2 } from "react-feather";
import { downloadUrl } from "../helpers/download";
import { useToasts } from "../hooks/useToasts";
import { GetFileData } from "../types";
import { Button } from "./Button";
import { FileView } from "./FileView";
import { Time } from "./Time";

export const FileEmbed: FunctionComponent<{ file: GetFileData }> = (props) => {
  const setToast = useToasts();
  const [disabled, setDisabled] = useState(false);

  const download = async () => {
    try {
      setDisabled(true);
      await downloadUrl(props.file.urls.direct, props.file.displayName);
    } catch (err) {
      setToast({ error: true, text: err.message });
    } finally {
      setDisabled(false);
    }
  };

  const copy = () => {
    copyToClipboard(window.location.href);
    setToast({
      text: `Copied link to clipboard`,
    });
  };

  // todo: this doesn't scale down properly on mobile with long file names
  return (
    <div className="border rounded md:mx-24 border-dark-600">
      <FileView file={props.file} />
      <div className="flex items-center justify-between p-3 border-t border-dark-600">
        <div>
          <h1 className="mb-2 text-4xl font-bold">{props.file.displayName}</h1>
          <div className="flex">
            <div className="flex items-center justify-center mr-2 text-xs text-gray-600 " title="File Size">
              <FileText className="h-4" /> {prettyBytes(props.file.size)}
            </div>
            <div className="flex items-center justify-center text-xs text-gray-600" title="Created At">
              <Clock className="h-4" /> <Time date={props.file.createdAt} />
            </div>
            <div className="flex items-center justify-center text-xs text-gray-600" title="File Type">
              <Box className="h-4" /> {props.file.type}
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <Button prefix={<Share2 />} onClick={copy} className="mb-2">
            Copy Link
          </Button>
          <Button prefix={<Download />} onClick={download} disabled={disabled}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};
