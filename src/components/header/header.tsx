import classNames from "classnames";
import { FunctionComponent } from "react";
import { Crop } from "react-feather";
import { usePaths } from "../../hooks/usePaths";
import { useUser } from "../../hooks/useUser";
import { Button } from "../button/button";
import { Container } from "../container";
import { Link } from "../link";
import { HeaderUser } from "./header-user";

export const Header: FunctionComponent = () => {
  const user = useUser();
  const paths = usePaths();
  const classes = classNames("relative z-10 flex items-center justify-between h-16 my-auto transition", {
    "pointer-events-none": paths.loading,
    invisible: paths.loading,
  });

  return (
    <Container>
      <nav className={classes}>
        <div className="flex items-center">
          <Link href={paths?.home} className="flex">
            <Crop className="mr-2 text-brand" /> micro
          </Link>
        </div>
        <div className="flex items-center">
          {user.data ? (
            <HeaderUser userId={user.data.id} username={user.data.username} />
          ) : (
            <Button href={paths.login} className="bg-dark-500 hover:bg-dark-900">
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </Container>
  );
};
