import { useRouter } from "next/router";
import React, { ChangeEventHandler, DragEventHandler, useEffect, useRef, useState } from "react";
import { Upload as UploadIcon } from "react-feather";
import { Container } from "../components/container";
import { PageLoader } from "../components/page-loader";
import { Spinner } from "../components/spinner";
import { Title } from "../components/title";
import { Endpoints } from "../constants";
import { http } from "../helpers/http";
import { useToasts } from "../hooks/useToasts";
import { useUser } from "../hooks/useUser";

export default function Upload() {
  const user = useUser();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [hover, setHover] = useState(false);
  const setToast = useToasts();

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
      handleUpload(file);
    }
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
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

  if (!user.data) {
    return (
      <>
        <Title>Upload</Title>
        <PageLoader />
      </>
    );
  }

  return (
    <Container center>
      <Title>{uploading ? `Uploading...` : "Upload"}</Title>
      <div
        className="flex flex-col items-center justify-center w-full text-center shadow h-2/4 bg-dark-200 rounded-xl"
        onDrop={onDrop}
        onDragOver={onDragEvent()}
        onDragEnter={onDragEvent(true)}
        onDragLeave={onDragEvent(false)}
        onClick={openFileBrowser}
      >
        {uploading ? (
          <React.Fragment>
            <Spinner />
            <p className="text-gray-400 select-none">Uploading</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </div>
    </Container>
  );
}
