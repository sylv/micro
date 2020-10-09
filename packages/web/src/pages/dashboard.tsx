import { Button, Card, Grid, Input, Select, useToasts } from "@geist-ui/react";
import { DownloadCloud } from "@geist-ui/react-icons";
import { UserFilesResponse } from "@micro/api";
import Router from "next/router";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
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
import { logout, useUser } from "../hooks/useUser";

export default function Dashboard() {
  const { user, loading } = useUser();
  const [, setToast] = useToasts();
  const [subdomain, setSubdomain] = usePersistentState<string>("subdomain");
  const [domain, setDomain] = useState<string>();
  const fileData = useSWR<UserFilesResponse>(Endpoints.USER_FILES);
  const tokenData = useSWR(Endpoints.AUTH_TOKEN, { revalidateOnFocus: false });
  const token = tokenData.data && `Bearer ${tokenData.data.access_token}`;
  const supportsSubdomains = domain?.startsWith("*");

  useEffect(() => {
    if (!user && !loading) Router.push("/login");
    else if (user && !subdomain) setSubdomain(user.username);
  }, [user, loading]);

  const highlightToken = (evt: FocusEvent<HTMLInputElement>) => evt.target.select();
  const updateSubdomain = (evt: ChangeEvent<HTMLInputElement>) => setSubdomain(evt.target.value);
  const updateDomain = (option: string | string[]) => {
    setDomain(Array.isArray(option) ? option[0] : option);
  };

  const downloadConfig = () => {
    if (!domain || !subdomain) {
      return setToast({ type: "error", text: "Enter a valid domain and subdomain first." });
    }

    const host = domain.includes("*") ? domain.replace("*", subdomain) : domain;
    const name = `micro - ${host}.sxcu`;
    const content = generateConfig(token, host);
    downloadFile(name, content);
  };

  if (!user) {
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
                  label="Token"
                  onFocus={highlightToken}
                  initialValue={token}
                  disabled={!token}
                />
              </Grid>
              <Grid xs={6}>
                <Button className="max-width">Regenerate</Button>
              </Grid>
              <Grid xs={8}>
                <Input
                  width="100%"
                  label="Subdomain"
                  initialValue={subdomain}
                  onChange={updateSubdomain}
                  disabled={!supportsSubdomains}
                />
              </Grid>
              <Grid xs={8}>
                <Select width="100%" placeholder="Domain" onChange={updateDomain}>
                  <Select.Option value="i.sylver.me">i.sylver.me</Select.Option>
                  <Select.Option value="*.is-fucking.gay">*.is-fucking.gay</Select.Option>
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
        <FileList files={fileData.data} />
      </Grid.Container>
    </Container>
  );
}
