import { FunctionComponent } from "react";
import { usePaths } from "../../hooks/usePaths";
import { useToasts } from "../../hooks/useToasts";
import { logout } from "../../hooks/useUser";
import { Dropdown } from "../dropdown/dropdown";
import { DropdownDivider } from "../dropdown/dropdown-divider";
import { DropdownTab } from "../dropdown/dropdown-tab";
import { Link } from "../link";
import { UserPill } from "../user-pill";

export interface HeaderUserProps {
  username: string;
  userId: string;
}

export const HeaderUser: FunctionComponent<HeaderUserProps> = (props) => {
  const paths = usePaths();
  const setToast = useToasts();
  return (
    <>
      <Link href="/upload" className="mr-2 text-gray-500 transition hover:text-gray-400">
        Upload
      </Link>
      <Dropdown className="w-36" trigger={<UserPill username={props.username} userId={props.userId} />}>
        <DropdownTab href={paths.dashboard}>Dashboard</DropdownTab>
        <DropdownDivider />
        <DropdownTab
          className="text-red-400 hover:text-red-400"
          onClick={async () => {
            try {
              await logout();
            } catch (e) {
              setToast({
                text: e.message,
                error: true,
              });
            }
          }}
        >
          Sign Out
        </DropdownTab>
      </Dropdown>
    </>
  );
};
