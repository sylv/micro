import Router from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Download as DownloadIcon } from "react-feather";
import useSWR from "swr";
import { Avatar } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Container } from "../components/Container";
import { Dropdown, DropdownTab } from "../components/Dropdown";
import { DropdownContent } from "../components/Dropdown/content";
import { FileList } from "../components/FileList";
import { Input } from "../components/Input/input";
import { Select } from "../components/Input/select";
import { PageLoader } from "../components/PageLoader";
import { Title } from "../components/Title";
import { Endpoints } from "../constants";
import { downloadFile } from "../helpers/download";
import { generateConfig } from "../helpers/generateConfig";
import { http } from "../helpers/http";
import { useToasts } from "../hooks/useToasts";
import { logout, useUser } from "../hooks/useUser";
import { GetHostsData, GetUploadTokenData, PutUploadTokenData } from "../types";

// todo: subdomain validation (bad characters, too long, etc) with usernames and inputs
export default function Dashboard() {
  const user = useUser();
  const token = useSWR<GetUploadTokenData>(Endpoints.USER_TOKEN);
  const hosts = useSWR<GetHostsData>(Endpoints.HOSTS);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);
  const setToast = useToasts();
  const downloadable = selectedHosts.length;

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

  const onDomainChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSelectedHosts([event.target.value]);
  };

  /**
   * Download a customised ShareX config for the user based on their options.
   */
  const onDownloadClick = (direct: boolean) => {
    const config = generateConfig(token.data!.token, selectedHosts, direct);
    downloadFile(config.name.split("{{username}}").join(user.data!.username), config.content);
  };

  /**
   * Regenerate the users token and mutate the global user object.
   */
  const regenerateToken = async () => {
    if (regenerating) return;
    const confirmation = confirm('Are you sure you want to regenerate your token? Previously generated ShareX configs will be invalidated and anything using the old token will cease to function.') // prettier-ignore
    if (!confirmation) return;
    setRegenerating(true);

    try {
      const response = await http(Endpoints.USER_TOKEN, { method: "PUT" });
      const body = (await response.json()) as PutUploadTokenData;
      token.mutate(body, false);
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
    <Container className="mt-5">
      <Title>Dashboard</Title>
      <div className="grid grid-cols-8 gap-2">
        <Card className="flex-col items-center justify-center hidden col-span-1 md:flex">
          <Avatar id={user.data.id} className="w-24 mb-3"></Avatar>
          <Button type="secondary" onClick={logout}>
            Logout
          </Button>
        </Card>
        <Card className="col-span-full md:col-span-7">
          <h1 className="mb-3 text-3xl font-bold">Hello {user.data.username}</h1>
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
              <Select prefix="Host" placeholder="Hosts" onChange={onDomainChange}>
                {hosts.data.map((host) => (
                  <option key={host.data.key} value={host.data.key}>
                    {host.data.key.replace("{{username}}", user.data!.username)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="col-span-full md:col-span-2">
              <Dropdown
                trigger={
                  <Button prefix={<DownloadIcon />} disabled={!downloadable}>
                    ShareX Config
                  </Button>
                }
              >
                <DropdownContent matchWidth>
                  <DropdownTab onClick={() => onDownloadClick(false)}>
                    <p className="text-xs text-gray-600">Recommended</p>
                    Embedded
                  </DropdownTab>
                  <DropdownTab onClick={() => onDownloadClick(true)}>Direct</DropdownTab>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>
        </Card>
        <FileList />
      </div>
    </Container>
  );
}
