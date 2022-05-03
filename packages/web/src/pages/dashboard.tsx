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
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { http } from "../helpers/http.helper";
import { useToasts } from "../hooks/use-toasts.helper";
import { useUser } from "../hooks/use-user.helper";
import { GetHostsData, GetUploadTokenData, PutUploadTokenData } from "@micro/api";

// todo: subdomain validation (bad characters, too long, etc) with usernames and inputs
export default function Dashboard() {
  const user = useUser();
  const token = useSWR<GetUploadTokenData>(`user/token`);
  const hosts = useSWR<GetHostsData>(`hosts`);
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
    if (hosts.data && selectedHosts.length === 0) {
      const root = hosts.data.find((host) => host.root);
      if (root) setSelectedHosts([root.data.key]);
    }
  }, [hosts, selectedHosts]);

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
      const response = await http(`user/token`, { method: "PUT" });
      const body = (await response.json()) as PutUploadTokenData;
      mutate(`user`, null);
      mutate(`user/token`, body, false);
      setRegenerating(false);
      setToast({ text: "Your token has been regenerated." });
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occured.";
      setRegenerating(false);
      setToast({ error: true, text: message });
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
              <Input
                prefix="Upload Token"
                onFocus={(event) => event.target.select()}
                value={token.data.token}
                readOnly
              />
            </div>
            <div className="col-span-full md:col-span-2">
              <Button disabled={regenerating} onClick={regenerateToken}>
                Regenerate
              </Button>
            </div>
            <div className="col-span-full md:col-span-6">
              <HostList
                prefix="Hosts"
                hosts={hosts.data.filter((host) => host.authorised).map((host) => host.data.key)}
                username={user.data!.username}
                onChange={(hosts) => setSelectedHosts(hosts)}
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
