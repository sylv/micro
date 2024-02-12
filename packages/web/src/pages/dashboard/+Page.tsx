import type { FC } from 'react';
import { Container } from '../../components/container';
import { Title } from '../../components/title';
import { FileList } from '../../containers/file-list/file-list';
import { useUser } from '../../hooks/useUser';

export const Page: FC = () => {
  useUser(true);

  return (
    <Container className="mt-4">
      <Title>Dashboard</Title>
      <FileList />
    </Container>
  );
};
