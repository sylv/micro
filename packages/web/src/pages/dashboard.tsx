import { Button, Card, Grid, Input, Select, useToasts } from "@geist-ui/react";
import { DownloadCloud } from "@geist-ui/react-icons";
import { ConfigResponse, TokenResponse } from "@micro/api";
import axios from "axios";
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
import { usePersistentState } from "../hooks/usePersistentState";
import { getToken, logout, useUser } from "../hooks/useUser";

// todo: subdomain validation (bad characters, too long, etc) with usernames and inputs
export default function Dashboard() {
  const [, setToast] = useToasts();
  const { user, loading, mutate } = useUser();
  const [selectedDomain, setSelectedDomain] = useState<string>();
  const [regenerating, setRegenerating] = useState(false);
  const [subdomain, setSubdomain] = usePersistentState<string>("subdomain");
  const server = useSWR<ConfigResponse>(Endpoints.CONFIG);
  const domains = (server.data?.domains ?? []).sort();
  const defaultDomain = domains[0];
  const supportsSubdomains = selectedDomain?.startsWith("*");

  // redirecting users that aren't logged in
  // populating the subdomain field with their username
  useEffect(() => {
    if (!user && !loading) {
      Router.push("/login");
    } else if (user && !subdomain) {
      setSubdomain(user.username);
    }
  }, [user, loading]);

  // set default domain once loaded
  useEffect(() => {
    if (defaultDomain && !selectedDomain) {
      setSelectedDomain(defaultDomain);
    }
  }, [server.data]);

  // server config error handler
  useEffect(() => {
    if (server.error) {
      setToast({ type: "error", text: "Failed loading server configuration" });
      Router.push("/");
    }
  }, [server.error]);

  /**
   * Set the selected domain to the given option.
   */
  function updateDomain(option: string | string[]) {
    setSelectedDomain(Array.isArray(option) ? option[0] : option);
  }

  /**
   * Download a customised ShareX config for the user based on their options.
   */
  function downloadConfig() {
    if (!selectedDomain || !subdomain) {
      return setToast({ type: "error", text: "Enter a valid domain and subdomain first." });
    }

    const wildcard = selectedDomain.includes("*");
    const host = wildcard ? selectedDomain.replace("*", subdomain) : selectedDomain;
    const name = `micro - ${host}.sxcu`;
    const content = generateConfig(user.token, host);
    downloadFile(name, content);
  }

  /**
   * Regenerate the users token and mutate the global user object.
   */
  async function regenerateToken() {
    if (regenerating) return;
    // todo: this is bad and should probably be a modal
    const confirmation = confirm('Are you sure you want to regenerate your token? This will invalidate previous ShareX configurations.') // prettier-ignore
    if (!confirmation) return;
    setRegenerating(true);
    try {
      const options = { headers: { Authorization: getToken() } };
      const { data } = await axios.get<TokenResponse>(Endpoints.USER_TOKEN_RESET, options);
      user.token = data.access_token;
      mutate(user, true);
      setRegenerating(false);
      setToast({ type: "success", text: "Your token has been regenerated." });
    } catch (e) {
      setRegenerating(false);
      setToast({ type: "error", text: e.message });
    }
  }

  if (!user || !server.data) {
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
            <Avatar size="100%" id={user.id} className="mb-2"></Avatar>
            <Button className="max-width" onClick={logout}>
              Logout
            </Button>
          </Card>
        </Grid>
        <Grid xs={21}>
          <Card>
            <h3>Hello {user.username}</h3>
            <Grid.Container gap={0.8}>
              <Grid xs={18}>
                <Input
                  width="100%"
                  label="Upload Token"
                  onFocus={(evt) => evt.target.focus()}
                  value={user.token}
                  readOnly
                />
              </Grid>
              <Grid xs={6}>
                <Button className="max-width" disabled={regenerating} onClick={regenerateToken}>
                  Regenerate
                </Button>
              </Grid>
              <Grid xs={8}>
                <Input
                  width="100%"
                  label="Subdomain"
                  initialValue={subdomain}
                  onChange={(evt) => setSubdomain(evt.target.value)}
                  disabled={!supportsSubdomains}
                />
              </Grid>
              <Grid xs={8}>
                <Select
                  width="100%"
                  placeholder="Domain"
                  initialValue={defaultDomain}
                  onChange={updateDomain}
                >
                  {domains.map((domain) => (
                    <Select.Option key={domain} value={domain}>
                      {domain}
                    </Select.Option>
                  ))}
                </Select>
              </Grid>
              <Grid xs={8}>
                <Button icon={<DownloadCloud />} className="max-width" onClick={downloadConfig}>
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
