import { FunctionComponent } from "react";
import { Download as DownloadIcon } from "react-feather";
import { downloadFile } from "../helpers/download";
import { generateConfig } from "../helpers/generateConfig";
import { useUser } from "../hooks/useUser";
import { Button } from "./button/button";
import { Dropdown } from "./dropdown/dropdown";
import { DropdownTab } from "./dropdown/dropdown-tab";

export interface ShareXButtonProps {
  token: string;
  hosts: string[];
}

export const ShareXButton: FunctionComponent<ShareXButtonProps> = (props) => {
  const user = useUser();
  const disabled = !user.data || !props.hosts[0];

  const onDownloadClick = (direct: boolean) => {
    if (!user.data) return;
    const config = generateConfig(props.token, props.hosts, direct);
    downloadFile(config.name.split("{{username}}").join(user.data.username), config.content);
  };

  return (
    <Dropdown
      className="right-0 left-0 w-auto"
      trigger={
        <Button prefix={<DownloadIcon />} disabled={disabled}>
          ShareX Config
        </Button>
      }
    >
      <DropdownTab onClick={() => onDownloadClick(false)}>
        <p className="text-xs text-gray-600">Recommended</p>
        Embedded
      </DropdownTab>
      <DropdownTab onClick={() => onDownloadClick(true)}>Direct</DropdownTab>
    </Dropdown>
  );
};
