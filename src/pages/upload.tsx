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
import { http } from "../helpers/http";
import { useToasts } from "../hooks/useToasts";
import { useUser } from "../hooks/useUser";
import { GetHostsData } from "../types";

export default function Upload() {
  const user = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [hover, setHover] = useState(false);
  const setToast = useToasts();
  const hosts = useSWR<GetHostsData>(Endpoints.HOSTS);

  useEffect(() => {
    if (user.error) router.replace("/");
  }, [user.data]);

  const onDragEvent = (entering?: boolean): DragEventHandler => (event) => {
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
      const response = await http(Endpoints.UPLOAD, {
        method: "POST",
        body: form,
      });

      const body = await response.json();
      router.push(`/file/${body.id}`);
    } catch (err) {
      setToast({ error: true, text: err.message });
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
            <Select prefix="Host" onClick={(e) => e.stopPropagation()} className="flex-shrink-0 w-40 mr-2">
              {hosts.data
                .filter((host) => host.authorised)
                .map((host) => (
                  <option key={host.data.key} value={host.data.key}>
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
