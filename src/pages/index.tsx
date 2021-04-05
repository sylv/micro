import { useRouter } from "next/router";
import useSWR from "swr";
import { Container } from "../components/Container";
import { Spinner } from "../components/Spinner";
import { Endpoints } from "../constants";
import { GetServerConfigData } from "../types";

export default function Home() {
  const router = useRouter();
  const initialData = router.query.invite && JSON.parse(router.query.invite as string);
  const server = useSWR<GetServerConfigData>(Endpoints.CONFIG, { initialData });
  const hosts = server.data?.hosts ?? [];
  const loading = !server.data && !server.error;

  return (
    <Container>
      <div className="pt-16">
        <h1 className="text-4xl font-bold">Micro</h1>
        <p className="mb-2">
          An invite-only file sharing and paste service with vanity domains and a ShareX compatible endpoint. Sign in to
          download a generated ShareX configuration. You can view the source code{" "}
          <a className="text-brand" href="https://github.com/sylv/micro" target="_blank">
            here.
          </a>
        </p>
        <h3 className="text-2xl font-bold">Domains</h3>
        <ul className="mb-2 ml-2 list-disc list-inside">
          {loading ? <Spinner /> : hosts.map((domain) => <li key={domain}>{domain}</li>)}
        </ul>
        <h3 className="text-2xl font-bold">Contact</h3>
        {!server.data ? (
          <Spinner />
        ) : (
          <p>
            To get an account or get a file taken down, email{" "}
            <a href={`mailto:${server.data.inquiries}`} className="text-brand">
              {server.data.inquiries}
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
