import { useRouter } from "next/router";
import React, { ChangeEventHandler, DragEventHandler, useEffect, useRef, useState } from "react";
import { Upload as UploadIcon } from "react-feather";
import useSWR from "swr";
import { Button } from "../components/button/button";
import { Card } from "../components/card";
import { Container } from "../components/container";
import { Select } from "../components/input/select";
import { PageLoader } from "../components/page-loader";
import { Spinner } from "../components/spinner";
import { Title } from "../components/title";
import { Endpoints } from "../constants";
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { http } from "../helpers/http.helper";
import { useHost } from "../hooks/use-host.hook";
import { useToasts } from "../hooks/use-toasts.helper";
import { useUser } from "../hooks/use-user.helper";
import { GetHostsData } from "../types";

export default function Upload() {
  const user = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [hover, setHover] = useState(false);
  const setToast = useToasts();
  const [selectedHost, setSelectedHost] = useState<string | undefined>();
  const hosts = useSWR<GetHostsData>(Endpoints.HOSTS);
  const currentHost = useHost();

  useEffect(() => {
    if (user.error) router.replace("/");
  }, [user.error, router]);

  const onDragEvent =
    (entering?: boolean): DragEventHandler =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (entering === true) setHover(true);
      else if (entering === false) setHover(false);
    };

  const onDrop: DragEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setHover(false);
    const transfer = event.dataTransfer;
    const file = transfer.files.item(0);
    if (file) {
      setFile(file);
    }
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) return;
      setUploading(true);
      const form = new FormData();
      form.append(file.name, file);
      const headers: HeadersInit = {};
      if (selectedHost) headers["X-Micro-Host"] = selectedHost;
      const response = await http(Endpoints.UPLOAD, {
        method: "POST",
        body: form,
        headers: headers,
      });

      const body = await response.json();
      const route = `/file/${body.id}`;
      const host = hosts.data?.find((host) => host.data.key === selectedHost);
      if (host && currentHost?.data.key !== host.data.key) {
        location.href = `${host.data.url}${route}`;
      } else {
        router.push(route);
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occured.";
      setToast({ error: true, text: message });
    } finally {
      setFile(null);
      setUploading(false);
    }
  };

  const openFileBrowser = () => {
    if (file) return;
    inputRef.current?.click();
  };

  if (!user.data || !hosts.data) {
    return (
      <>
        <Title>Upload</Title>
        <PageLoader />
      </>
    );
  }

  if (uploading) {
    return (
      <Container center>
        <Title>Uploading</Title>
        <Card className="flex flex-col items-center justify-center w-full h-2/4">
          <Spinner />
          <p className="text-gray-400 select-none">Uploading</p>
        </Card>
      </Container>
    );
  }

  if (file) {
    return (
      <Container center>
        <Title>Upload {file.name}</Title>
        <Card className="flex flex-col items-center justify-center w-full h-2/4">
          <h1 className="mb-4 text-2xl">{file.name}</h1>
          <div className="flex items-center justify-center">
            <Select
              prefix="Host"
              className="flex-shrink-0 w-40 mr-2"
              value={selectedHost}
              onChange={(event) => setSelectedHost(event.target.value)}
            >
              {hosts.data
                .filter((host) => host.authorised)
                .map((host) => (
                  <option key={host.data.key} value={host.data.key} selected={host.data.key === selectedHost}>
                    {host.data.key.replace("{{username}}", user.data!.username)}
                  </option>
                ))}
            </Select>
            <Button primary onClick={handleUpload}>
              Upload
            </Button>
          </div>
          <span className="mt-4 cursor-pointer text-brand" onClick={() => setFile(null)}>
            Cancel
          </span>
        </Card>
      </Container>
    );
  }

  return (
    <Container center>
      <Title>Upload</Title>
      <Card
        className="flex flex-col items-center justify-center w-full h-2/4"
        onDrop={onDrop}
        onDragOver={onDragEvent()}
        onDragEnter={onDragEvent(true)}
        onDragLeave={onDragEvent(false)}
        onClick={openFileBrowser}
      >
        <input type="file" id="file" className="hidden" ref={inputRef} onChange={onFileChange} />
        <h1 className="mb-2 text-2xl">
          {hover ? (
            <span className="flex items-center">
              Release to upload <UploadIcon className="ml-2" />
            </span>
          ) : (
            <span>Drag and drop a file to upload</span>
          )}
        </h1>
        <p className="text-gray-400 select-none">
          Or <span className="text-brand">click here</span> to select a file.
        </p>
      </Card>
    </Container>
  );
}
