import type { FC } from 'react';
import { Fragment } from 'react';
import { getErrorMessage } from '../../helpers/get-error-message.helper';
import { usePaths } from '../../hooks/use-paths.helper';
import { useToasts } from '../../hooks/use-toasts.helper';
import { logout } from '../../hooks/use-user.helper';
import { Dropdown } from '../dropdown/dropdown';
import { DropdownDivider } from '../dropdown/dropdown-divider';
import { DropdownTab } from '../dropdown/dropdown-tab';
import { Link } from '../link';
import { UserPill } from '../user-pill';

export interface HeaderUserProps {
  username: string;
  userId: string;
}

export const HeaderUser: FC<HeaderUserProps> = (props) => {
  const paths = usePaths();
  const setToast = useToasts();
  return (
    <Fragment>
      <Link href="/upload" className="mr-2 text-gray-500 transition hover:text-gray-400">
        Upload
      </Link>
      <Dropdown className="w-36" trigger={<UserPill username={props.username} userId={props.userId} />}>
        <DropdownTab href={paths.files}>Files</DropdownTab>
        <DropdownTab href={paths.preferences}>Preferences</DropdownTab>
        <DropdownDivider />
        <DropdownTab
          className="text-red-400 hover:text-red-400"
          onClick={async () => {
            try {
              await logout();
            } catch (error: unknown) {
              const message = getErrorMessage(error) ?? 'Failed to sign-out.';
              setToast({
                text: message,
                error: true,
              });
            }
          }}
        >
          Sign Out
        </DropdownTab>
      </Dropdown>
    </Fragment>
  );
};
