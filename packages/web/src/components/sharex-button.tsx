import type { FC } from 'react';
import { Download as DownloadIcon } from 'react-feather';
import { downloadFile } from '../helpers/download.helper';
import { generateConfig } from '../helpers/generate-config.helper';
import { useUser } from '../hooks/use-user.helper';
import { Button } from './button/button';
import { Dropdown } from './dropdown/dropdown';
import { DropdownTab } from './dropdown/dropdown-tab';

export interface ShareXButtonProps {
  token: string;
  hosts: string[];
}

export const ShareXButton: FC<ShareXButtonProps> = ({ token, hosts }) => {
  const user = useUser();
  const disabled = !user.data || !hosts[0];

  const onDownloadClick = (direct: boolean) => {
    if (!user.data) return;
    const config = generateConfig(token, hosts, direct);
    downloadFile(config.name.split('{{username}}').join(user.data.username), config.content);
  };

  return (
    <Dropdown
      className="left-0 right-0 w-auto"
      trigger={
        <Button disabled={disabled}>
          <DownloadIcon className="h-4" /> ShareX Config
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
