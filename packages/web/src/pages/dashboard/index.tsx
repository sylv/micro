import { Container } from '../../components/container';
import { FileList } from '../../containers/file-list/file-list';
import { useUser } from '../../hooks/useUser';

export default function Dashboard() {
  useUser(true);

  return (
    <Container className="mt-4">
      <FileList />
    </Container>
  );
}
