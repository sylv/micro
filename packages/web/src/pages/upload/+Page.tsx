import type { ChangeEventHandler, DragEventHandler, FC } from "react";
import { useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { navigate } from "vike/client/router";
import { Button } from "../../components/button";
import { Card } from "../../components/card";
import { Container } from "../../components/container";
import { Select } from "../../components/input/select";
import { PageLoader } from "../../components/page-loader";
import { Spinner } from "../../components/spinner";
import { createToast } from "../../components/toast/store";
import { ToastStyle } from "../../components/toast/toast";
import { getErrorMessage } from "../../helpers/get-error-message.helper";
import { http } from "../../helpers/http.helper";
import { replaceUsername } from "../../helpers/replace-username.helper";
import { useConfig } from "../../hooks/useConfig";
import { useUser } from "../../hooks/useUser";

interface CreateFileResponse {
  id: string;
  hostname?: string;
  urls: {
    view: string;
  };
}

export const title = "Upload File — micro";

export const Page: FC = () => {
  const user = useUser(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [hover, setHover] = useState(false);
  const [selectedHost, setSelectedHost] = useState<string | undefined>();
  const config = useConfig();

  const onDragEvent =
    (entering?: boolean): DragEventHandler<HTMLDivElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (entering === true) setHover(true);
      else if (entering === false) setHover(false);
    };

  const onDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setHover(false);
    const file = event.dataTransfer?.files.item(0);
    if (file) {
      setFile(file);
    }
  };

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = event.clipboardData?.files?.[0];
      if (file) {
        setFile(file);
      }
    };

    document.addEventListener("paste", onPaste);
    return () => {
      document.removeEventListener("paste", onPaste);
    };
  }, []);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file || !user.data || !config.data) return;
      setUploading(true);
      const form = new FormData();
      form.append(file.name, file);
      const headers: HeadersInit = {};
      if (selectedHost) headers["X-Micro-Host"] = selectedHost;
      const response = await http("file", {
        method: "POST",
        body: form,
        headers: headers,
      });

      const body: CreateFileResponse = await response.json();
      const route = `/file/${body.id}`;
      const isSameHost = body.hostname === config.data.currentHost.normalised;
      if (isSameHost) {
        navigate(route);
      }

      location.href = body.urls.view;
      setFile(null);
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occured.";
      createToast({ style: ToastStyle.Error, message: message });
    } finally {
      setUploading(false);
    }
  };

  const openFileBrowser = () => {
    if (file) return;
    inputRef.current?.click();
  };

  if (!user.data || !config.data) {
    return <PageLoader />;
  }

  if (uploading) {
    return (
      <Container center>
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
        <Card className="flex flex-col items-center justify-center w-full h-2/4">
          <h1 className="mb-4 text-2xl">{file.name}</h1>
          <div className="flex items-center justify-center gap-4">
            <Select
              prefix="Host"
              className="shrink-0 w-40 mr-2"
              value={selectedHost}
              onChange={(event) => setSelectedHost(event.currentTarget.value)}
            >
              {config.data.hosts.map((host) => (
                <option
                  key={host.normalised}
                  value={host.normalised}
                  selected={host.normalised === selectedHost}
                >
                  {replaceUsername(host.normalised, user.data!.username)}
                </option>
              ))}
            </Select>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
          <button
            type="button"
            className="mt-4 cursor-pointer text-primary"
            onClick={() => {
              setFile(null);
            }}
          >
            Cancel
          </button>
        </Card>
      </Container>
    );
  }

  return (
    <Container center>
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
              Release to upload <FiUpload className="ml-2 h-[24px] w-[24px]" />
            </span>
          ) : (
            <span>Drag and drop a file to upload</span>
          )}
        </h1>
        <p className="text-gray-400 select-none">
          Or <span className="text-primary">click here</span> to select a file.
          <br />
          Or <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste a file.
        </p>
      </Card>
    </Container>
  );
};
