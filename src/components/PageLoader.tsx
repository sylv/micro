import { FunctionComponent, useEffect } from "react";
import { Container } from "./Container";
import { Spinner } from "./Spinner";

export const PageLoader: FunctionComponent = () => {
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
