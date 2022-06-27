import { Container } from '../../components/container';
import { FileList } from '../../components/file-list/file-list';

export default function Dashboard() {
  return (
    <Container className="mt-4">
      <FileList />
    </Container>
  );
}
