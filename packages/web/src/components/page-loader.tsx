import { FC, useEffect } from "react";
import { Container } from "./container";
import { Spinner } from "./spinner";

export const PageLoader: FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  });

  return (
    <Container center>
      <Spinner size="large" />
    </Container>
  );
};
