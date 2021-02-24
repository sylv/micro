import { useRouter } from "next/router";
import useSWR from "swr";
import { ContainerCenter } from "../../components/Container";
import { FileViewer } from "../../components/FileViewer";
import { PageLoader } from "../../components/PageLoader";
import { Title } from "../../components/Title";
import { GetFileData } from "../../types";
import Error from "../_error";

export default function File() {
  const router = useRouter();
  const fileId = router.query.fileId;
  const initialData = router.query.file && JSON.parse(router.query.file as string);
  const file = useSWR<GetFileData>(`/api/file/${fileId}`, { initialData });
  if (file.error) {
    return <Error title={file.error.status} message={file.error.text} />;
  }

  if (!file.data) {
    return <PageLoader />;
  }

  return (
    <ContainerCenter>
      <Title>{file.data.displayName}</Title>
      <FileViewer file={file.data}></FileViewer>
    </ContainerCenter>
  );
}

// without this router.query.file does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
