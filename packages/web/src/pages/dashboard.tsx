import { Button, Card, Grid, Input, Select, useToasts } from "@geist-ui/react";
import { DownloadCloud } from "@geist-ui/react-icons";
import { ConfigResponse } from "@micro/api";
import Router from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Avatar } from "../components/Avatar";
import { Container } from "../components/Container";
import { FileList } from "../components/FileList";
import { PageLoader } from "../components/PageLoader";
import { Title } from "../components/Title";
import { Endpoints } from "../constants";
import { downloadFile } from "../helpers/downloadFile";
import { generateConfig } from "../helpers/generateConfig";
import { replacePlaceholders } from "../helpers/replacePlaceholders";
import { logout, useUser } from "../hooks/useUser";

// todo: subdomain validation (bad characters, too long, etc) with usernames and inputs
export default function Dashboard() {
  const user = useUser();
  const token = useSWR(Endpoints.USER_TOKEN);
  const server = useSWR<ConfigResponse>(Endpoints.CONFIG);
  const [domain, setDomain] = useState<string>();
  const [regenerating, setRegenerating] = useState(false);
  const [, setToast] = useToasts();

  useEffect(() => {
    // redirect home if any of the requests fail
    if (user.error || server.error || token.error) {
      Router.replace("/");
    }
  }, [user]);

  useEffect(() => {
    // set the default domain once they're loaded
    if (server && !domain) setDomain(server.data.domains[0]);
  }, [server]);

  /**
   * Set the selected domain to the given option.
   */
  function updateDomain(option: string | string[]) {
    setDomain(Array.isArray(option) ? option[0] : option);
  }

  /**
   * Download a customised ShareX config for the user based on their options.
   */
  function downloadConfig() {
    const host = replacePlaceholders(domain, { username: user.data.username });
    const name = `micro - ${host}.sxcu`;
    const content = generateConfig(token.data.access_token, host);
    downloadFile(name, content);
  }

  /**
   * Regenerate the users token and mutate the global user object.
   */
  async function regenerateToken() {
    if (regenerating) return;
    const confirmation = confirm('Are you sure you want to regenerate your token? This will invalidate previous ShareX configurations.') // prettier-ignore
    if (!confirmation) return;
    setRegenerating(true);

    try {
      const response = await fetch(Endpoints.USER_TOKEN_RESET);
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      const body = await response.json();
      token.mutate(body, false);
      setRegenerating(false);
      setToast({ type: "success", text: "Your token has been regenerated." });
    } catch (e) {
      setRegenerating(false);
      setToast({ type: "error", text: e.message });
    }
  }

  if (!user.data || !server.data || !token.data) {
    return (
      <>
        <Title>Dashboard</Title>
        <PageLoader />
      </>
    );
  }

  return (
    <Container className="mt-5">
      <Title>Dashboard</Title>
      <Grid.Container gap={0.8}>
        <Grid xs={3}>
          <Card>
            <Avatar size="100%" id={user.data.id} className="mb-2"></Avatar>
            <Button className="max-width" onClick={logout}>
              Logout
            </Button>
          </Card>
        </Grid>
        <Grid xs={21}>
          <Card>
            <h3>Hello {user.data.username}</h3>
            <Grid.Container gap={0.8}>
              <Grid xs={18}>
                <Input
                  width="100%"
                  label="Upload Token"
                  onFocus={(evt) => evt.target.select()}
                  value={token.data.access_token}
                  readOnly
                />
              </Grid>
              <Grid xs={6}>
                <Button className="max-width" disabled={regenerating} onClick={regenerateToken}>
                  Regenerate
                </Button>
              </Grid>
              <Grid xs={12}>
                <Select
                  width="100%"
                  placeholder="Domain"
                  initialValue={server.data.domains[0]}
                  onChange={updateDomain}
                >
                  {server.data.domains.map((domain) => (
                    <Select.Option key={domain} value={domain}>
                      {replacePlaceholders(domain, {
                        username: user.data.username,
                      })}
                    </Select.Option>
                  ))}
                </Select>
              </Grid>
              <Grid xs={12}>
                <Button
                  icon={<DownloadCloud />}
                  className="max-width"
                  onClick={downloadConfig}
                  disabled={!domain}
                >
                  ShareX Config
                </Button>
              </Grid>
            </Grid.Container>
          </Card>
        </Grid>
        <FileList />
      </Grid.Container>
    </Container>
  );
}
