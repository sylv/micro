import copyToClipboard from "copy-to-clipboard";
import { useRouter } from "next/router";
import { Download as DownloadIcon, Share2 as ShareIcon } from "react-feather";
import useSWR from "swr";
import { Container } from "../../components/container";
import { FileEmbed } from "../../components/file-embed/file-embed";
import { PageLoader } from "../../components/page-loader";
import { Title } from "../../components/title";
import { Endpoints } from "../../constants";
import { downloadUrl } from "../../helpers/download";
import { useToasts } from "../../hooks/useToasts";
import { GetFileData } from "../../types";
import Error from "../_error";

export default function File() {
  const router = useRouter();
  const fileId = router.query.fileId as string;
  const initialData = router.query.file && JSON.parse(router.query.file as string);
  const file = useSWR<GetFileData>(Endpoints.FILE(fileId), { initialData });
  const setToast = useToasts();

  if (file.error) {
    return <Error status={file.error.status} message={file.error.text} />;
  }

  if (!file.data) {
    return <PageLoader />;
  }

  const download = async () => {
    try {
      await downloadUrl(file.data!.urls.direct, file.data!.displayName);
    } catch (err) {
      setToast({ error: true, text: err.message });
    }
  };

  const copy = () => {
    copyToClipboard(window.location.href);
    setToast({
      text: `Copied link to clipboard`,
    });
  };

  return (
    <Container className="mt-5 md-2 md:mt-10 md:mb-5">
      <Title>{file.data.displayName}</Title>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <div className="flex items-end col-span-5">
          <h1 className="mr-2 text-xl font-bold truncate md:text-4xl md:break-all">{file.data.displayName}</h1>
        </div>
        <FileEmbed file={file.data} />
        <div className="flex md:flex-col">
          <div className="flex text-sm text-gray-500 cursor-pointer md:flex-col">
            <span className="flex items-center flex-shrink-0 mb-2 mr-2 transition-colors duration-100 hover:text-gray-300" onClick={copy}>
              <ShareIcon className="h-4 mr-1" /> Copy link
            </span>
            <span
              className="flex items-center flex-shrink-0 mb-2 mr-2 transition-colors duration-100 hover:text-gray-300"
              onClick={download}
            >
              <DownloadIcon className="h-4 mr-1" /> Download
            </span>
          </div>
        </div>
      </div>
    </Container>
  );
}

// without this router.query.file does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
