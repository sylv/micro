import type { FC } from "react";
import { Container } from "../../components/container";
import { FileList } from "../../containers/file-list/file-list";
import { useUser } from "../../hooks/useUser";

export const title = "Dashboard — micro";

export const Page: FC = () => {
  useUser(true);

  return (
    <Container className="mt-4">
      <FileList />
    </Container>
  );
};
