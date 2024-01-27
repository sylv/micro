import type { FC } from 'react';
import { Fragment } from 'react';
import { usePaths } from '../../hooks/usePaths';
import { useUser } from '../../hooks/useUser';
import { Link } from '../link';
import { UserPill } from '../user-pill';
import { Dropdown, DropdownDivider, DropdownTab } from '../dropdown';

export interface HeaderUserProps {
  username: string;
  userId: string;
}

export const HeaderUser: FC<HeaderUserProps> = (props) => {
  const paths = usePaths();
  const user = useUser();

  return (
    <Fragment>
      <Link href="/shorten" className="mr-2 text-gray-500 transition hover:text-gray-400">
        Shorten
      </Link>
      <Link href="/paste" className="mr-2 text-gray-500 transition hover:text-gray-400">
        Paste
      </Link>
      <Link href="/upload" className="mr-2 text-gray-500 transition hover:text-gray-400">
        Upload
      </Link>
      <Dropdown className="w-36" trigger={<UserPill username={props.username} userId={props.userId} />}>
        <DropdownTab href={paths.files}>Uploads</DropdownTab>
        <DropdownTab href={paths.preferences}>Preferences</DropdownTab>
        <DropdownDivider />
        <DropdownTab
          className="text-red-400 hover:text-red-400"
          onClick={() => {
            user.logout();
          }}
        >
          Sign Out
        </DropdownTab>
      </Dropdown>
    </Fragment>
  );
};
