import { Spinner } from "@geist-ui/react";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";
import { Container } from "../components/Container";
import { GetServerConfigData } from "../types";
import { Endpoints } from "../endpoints";

const HomeWrapper = styled.div`
  padding-top: 5em;
`;

export default function Home() {
  const router = useRouter();
  const initialData = router.query.invite && JSON.parse(router.query.invite as string);
  const server = useSWR<GetServerConfigData>(Endpoints.CONFIG, { initialData });
  const hosts = server.data?.hosts ?? [];
  const loading = !server.data && !server.error;

  return (
    <Container>
      <HomeWrapper>
        <h1>Micro</h1>
        <p>
          An invite-only file sharing service with vanity domains and a ShareX compatible endpoint. Sign in to download
          a generated ShareX configuration.
        </p>
        <h3>Domains</h3>
        <ul>{loading ? <Spinner /> : hosts.map((domain) => <li key={domain}>{domain}</li>)}</ul>
        <h3>Rules</h3>
        <ol>
          <li>Do not upload NSFW content.</li>
          <li>Do not upload illegal content.</li>
          <li>Do not upload content you do not own.</li>
          <li>Don't upload excessive amounts of content. This is a file sharing server, not a file storage server.</li>
        </ol>
        <h3>Contact</h3>
        {loading ? (
          <Spinner />
        ) : (
          <p>
            To get an account or get a file taken down, email{" "}
            <a href={`mailto:${server.data!.inquiries}`}>{server.data!.inquiries}</a>.
          </p>
        )}
      </HomeWrapper>
    </Container>
  );
}

// without this router.query.invite does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
