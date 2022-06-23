import type { FC} from "react";
import { useEffect } from "react";
import { Container } from "./container";
import { Spinner } from "./spinner";
import { Title } from "../components/title";

export const PageLoader: FC<{ title?: string }> = ({ title }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <Container center>
      {title && <Title>{title}</Title>}
      <Spinner size="large" />
    </Container>
  );
};
