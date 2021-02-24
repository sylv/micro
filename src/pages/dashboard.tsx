import { Button, ButtonGroup, Card, Grid, Input, Select, useToasts } from "@geist-ui/react";
import { Box as BoxIcon, Download as DownloadIcon } from "@geist-ui/react-icons";
import Router from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Avatar } from "../components/Avatar";
import { Container } from "../components/Container";
import { FileList } from "../components/FileList";
import { PageLoader } from "../components/PageLoader";
import { Title } from "../components/Title";
import { downloadFile } from "../helpers/downloadFile";
import { generateConfig } from "../helpers/generateConfig";
import { http } from "../helpers/http";
import { replacePlaceholders } from "../helpers/replacePlaceholders";
import { logout, useUser } from "../hooks/useUser";
import { GetUploadTokenData, GetServerConfigData, PutUploadTokenData } from "../types";
import { Endpoints } from "../constants";

// todo: subdomain validation (bad characters, too long, etc) with usernames and inputs
export default function Dashboard() {
  const user = useUser();
  const token = useSWR<GetUploadTokenData>(Endpoints.USER_UPLOAD_TOKEN);
  const server = useSWR<GetServerConfigData>(Endpoints.CONFIG);
  const [hosts, setHosts] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);
  const [, setToast] = useToasts();
  const downloadable = !!hosts[0];

  useEffect(() => {
    // redirect home if any of the requests fail
    if (user.error || server.error || token.error) {
      Router.replace("/");
    }
  }, [user]);

  useEffect(() => {
    // set the default domain once they're loaded
    if (server.data && !hosts[0]) setHosts([server.data.host]);
  }, [server]);

  /**
   * Set the selected domain to the given option.
   */
  function updateDomain(options: string | string[]) {
    if (typeof options === "string") throw new Error("Unexpected option type.");
    setHosts(options);
  }

  /**
   * Download a customised ShareX config for the user based on their options.
   */
  function downloadConfig(direct: boolean) {
    const formatted = hosts.map((host) => replacePlaceholders(host, user.data!));
    const config = generateConfig(token.data!.upload_token, formatted, direct);
    downloadFile(config.name, config.content);
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
      const response = await http(Endpoints.USER_UPLOAD_TOKEN, { method: "PUT" });
      const body = (await response.json()) as PutUploadTokenData;
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
                  value={token.data.upload_token}
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
                  multiple
                  width="100%"
                  placeholder="Hosts"
                  initialValue={server.data.hosts[0]}
                  onChange={updateDomain}
                >
                  {server.data.hosts.map((domain) => (
                    <Select.Option key={domain} value={domain}>
                      {replacePlaceholders(domain, { username: user.data!.username })}
                    </Select.Option>
                  ))}
                </Select>
              </Grid>
              <Grid xs={12}>
                <ButtonGroup className="max-width">
                  <Button
                    icon={<BoxIcon />}
                    className="max-width"
                    onClick={() => downloadConfig(false)}
                    disabled={!downloadable}
                  >
                    Embedded ShareX Config
                  </Button>
                  <Button
                    icon={<DownloadIcon />}
                    className="max-width"
                    onClick={() => downloadConfig(true)}
                    disabled={!downloadable}
                  >
                    Direct ShareX Config
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid.Container>
          </Card>
        </Grid>
        <FileList />
      </Grid.Container>
    </Container>
  );
}
