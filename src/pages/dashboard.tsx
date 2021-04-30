import Router from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "../components/button/button";
import { Container } from "../components/container";
import { FileList } from "../components/file-list/file-list";
import { HostList } from "../components/host-list";
import { Input } from "../components/input/input";
import { PageLoader } from "../components/page-loader";
import { Section } from "../components/section";
import { ShareXButton } from "../components/sharex-button";
import { Title } from "../components/title";
import { Endpoints } from "../constants";
import { http } from "../helpers/http";
import { useToasts } from "../hooks/useToasts";
import { useUser } from "../hooks/useUser";
import { GetHostsData, GetUploadTokenData, PutUploadTokenData } from "../types";

// todo: subdomain validation (bad characters, too long, etc) with usernames and inputs
export default function Dashboard() {
  const user = useUser();
  const token = useSWR<GetUploadTokenData>(Endpoints.USER_TOKEN);
  const hosts = useSWR<GetHostsData>(Endpoints.HOSTS);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);
  const setToast = useToasts();

  useEffect(() => {
    if (hosts.error || token.error) Router.replace("/");
    if (user.error) {
      // todo: for some reason making this /login results in
      // infinite loops of redirects between /login and /dashboard
      // but only sometimes. that shouldn't happen.
      Router.replace("/");
    }
  }, [user, hosts, token]);

  useEffect(() => {
    // set the default domain once they're loaded
    if (hosts.data && !selectedHosts[0]) {
      const root = hosts.data.find((host) => host.root);
      if (root) setSelectedHosts([root?.data.key]);
    }
  }, [hosts]);

  useEffect(() => {
    Router.prefetch("/file/[fileId]");
  }, []);

  /**
   * Regenerate the users token and mutate the global user object.
   */
  const regenerateToken = async () => {
    if (regenerating) return;
    const confirmation = confirm('Are you sure you want to regenerate your token? Existing tokens and configs will be revoked and you will be signed out.') // prettier-ignore
    if (!confirmation) return;
    setRegenerating(true);

    try {
      const response = await http(Endpoints.USER_TOKEN, { method: "PUT" });
      const body = (await response.json()) as PutUploadTokenData;
      mutate(Endpoints.USER, null);
      mutate(Endpoints.USER_TOKEN, body, false);
      setRegenerating(false);
      setToast({ text: "Your token has been regenerated." });
    } catch (e) {
      setRegenerating(false);
      setToast({ error: true, text: e.message });
    }
  };

  if (!user.data || !hosts.data || !token.data) {
    return (
      <>
        <Title>Dashboard</Title>
        <PageLoader />
      </>
    );
  }

  return (
    <>
      <Section className="mt-5">
        <Title>Dashboard</Title>
        <Container>
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-full md:col-span-6">
              <Input prefix="Upload Token" onFocus={(evt) => evt.target.select()} value={token.data.token} readOnly />
            </div>
            <div className="col-span-full md:col-span-2">
              <Button disabled={regenerating} onClick={regenerateToken}>
                Regenerate
              </Button>
            </div>
            <div className="col-span-full md:col-span-6">
              <HostList
                prefix="Hosts"
                // hosts={hosts.data.filter((host) => host.authorised).map((host) => host.data.key)}
                username={user.data!.username}
                onChange={(hosts) => setSelectedHosts(hosts)}
                hosts={[
                  "aawd",
                  "aoiud",
                  "axpoiuawd",
                  "aad09p8b",
                  "a908awd",
                  "aoxiujawd",
                  "aiopu",
                  "abiouawd",
                  "abiuawd",
                  "aawdoiuawd",
                  "aawdpiouawd",
                  "aawdopuawd",
                  "awd",
                  "62345",
                  "has",
                  "423",
                  "1234734573456745674567",
                  "2347456",
                ]}
              />
            </div>
            <div className="col-span-full md:col-span-2">
              <ShareXButton hosts={selectedHosts} token={token.data.token} />
            </div>
          </div>
        </Container>
      </Section>
      <Container className="mt-4">
        <FileList />
      </Container>
    </>
  );
}
