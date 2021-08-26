import { useRouter } from "next/router";
import { Container } from "../components/container";
import { Spinner } from "../components/spinner";
import { useConfig } from "../hooks/use-config.hook";

export default function Home() {
  const router = useRouter();
  const initialData = router.query.invite && JSON.parse(router.query.invite as string);
  const config = useConfig(true, initialData);
  const hosts = config.data?.hosts ?? [];
  const loading = !config.data && !config.error;

  return (
    <Container>
      <div className="pt-16">
        <h1 className="text-4xl mb-2 font-bold">Micro</h1>
        <p className="mb-2 text-gray-400">
          An invite-only file sharing and paste service with vanity domains and a ShareX compatible endpoint. Sign in to download a
          generated ShareX configuration. You can view the source code{" "}
          <a className="text-brand" href="https://github.com/sylv/micro" target="_blank" rel="noreferrer">
            here.
          </a>
        </p>
        <h3 className="text-2xl mb-2 font-bold">Domains</h3>
        <ul className="mb-2 ml-2 list-disc list-inside text-gray-400">
          {loading ? <Spinner /> : hosts.map((host) => <li key={host.data.key}>{host.data.key}</li>)}
        </ul>
        <h3 className="text-2xl mb-2 font-bold">Contact</h3>
        {!config.data ? (
          <Spinner />
        ) : (
          <p className="text-gray-400">
            To get an account or get a file taken down, email{" "}
            <a href={`mailto:${config.data.inquiries}`} className="text-brand">
              {config.data.inquiries}
            </a>
            .
          </p>
        )}
      </div>
    </Container>
  );
}

// without this router.query.invite does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
