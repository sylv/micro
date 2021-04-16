import classNames from "classnames";
import { FunctionComponent } from "react";
import { Crop } from "react-feather";
import { useConfig } from "../hooks/useConfig";
import { useHost } from "../hooks/useHost";
import { usePaths } from "../hooks/usePaths";
import { useUser } from "../hooks/useUser";
import { Button } from "./Button";
import { Container } from "./Container";
import { Link } from "./Link";

export const Menu: FunctionComponent = () => {
  const user = useUser();
  const paths = usePaths();
  const buttonText = user.data ? "Enter" : "Sign in";
  const buttonHref = user.data ? paths.dashboard : paths.login;
  const classes = classNames("relative z-10 flex items-center justify-between h-16 my-auto transition duration-150 ", {
    "pointer-events-none": paths.loading,
    invisible: paths.loading,
  });

  return (
    <Container>
      <nav className={classes}>
        <div className="flex items-center">
          <Link href={paths?.home} className="flex">
            <Crop className="mr-2" /> micro
          </Link>
        </div>
        <div className="flex items-center">
          <Button className="w-20 p-1.5 rounded-full" type="primary" href={buttonHref}>
            {buttonText}
          </Button>
        </div>
      </nav>
    </Container>
  );
};
