import { Spinner } from "@geist-ui/react";
import { useEffect } from "react";
import { ContainerCenter } from "./Container";

export function PageLoader() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = null;
    };
  });

  return (
    <ContainerCenter>
      <Spinner size="large" />
    </ContainerCenter>
  );
}
