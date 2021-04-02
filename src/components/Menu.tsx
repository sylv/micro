import classNames from "classnames";
import { FunctionComponent } from "react";
import { Crop } from "react-feather";
import useSWR from "swr";
import { Endpoints } from "../constants";
import { useUser } from "../hooks/useUser";
import { GetServerConfigData } from "../types";
import { Button } from "./Button";
import { Container } from "./Container";
import { Link } from "./Link";

export const Menu: FunctionComponent = () => {
  const user = useUser();
  const server = useSWR<GetServerConfigData>(Endpoints.CONFIG);
  const windowHost = typeof window === "undefined" ? "" : window.location.host;
  const base = server.data && server.data.host !== windowHost ? `//${server.data.host}/` : "/";
  const buttonHref = base + (user.data ? "dashboard" : "login");
  const buttonText = user.data ? "Enter" : "Sign in";
  const invisible = !server.data;
  const classes = classNames("relative z-10 flex items-center justify-between h-16 my-auto transition duration-150 ", {
    "pointer-events-none": invisible,
    invisible: invisible,
  });

  return (
    <Container>
      <nav className={classes}>
        <div className="flex items-center">
          <Link href={base} className="flex">
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
