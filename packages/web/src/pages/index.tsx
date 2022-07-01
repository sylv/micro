import { Container } from '../components/container';
import { Spinner } from '../components/spinner';
import { useConfig } from '../hooks/useConfig';

export default function Home() {
  const config = useConfig();
  const hosts = config.data?.hosts ?? [];
  const loading = !config.data && !config.error;

  return (
    <Container>
      <div className="pt-16">
        <h1 className="mb-2 text-4xl font-bold">Micro</h1>
        <p className="mb-2 text-gray-400">
          An invite-only file sharing and paste service with vanity domains and a ShareX compatible endpoint. Sign in to
          download a generated ShareX configuration. You can view the source code{' '}
          <a className="text-brand" href="https://github.com/sylv/micro" target="_blank" rel="noreferrer">
            here.
          </a>
        </p>
        <h3 className="mb-2 text-2xl font-bold">Domains</h3>
        <ul className="mb-2 ml-2 text-gray-400 list-disc list-inside">
          {loading ? <Spinner /> : hosts.map((host) => <li key={host.normalised}>{host.normalised}</li>)}
        </ul>
        <h3 className="mb-2 text-2xl font-bold">Contact</h3>
        {!config.data && <Spinner />}
        {config.data && (
          <p className="text-gray-400">
            To get an account or get a file taken down, email{' '}
            <a href={`mailto:${config.data.inquiriesEmail}`} className="text-brand">
              {config.data.inquiriesEmail}
            </a>
            .
          </p>
        )}
      </div>
    </Container>
  );
}
