import { File as APIFile } from "@micro/api";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ContainerCenter } from "../../components/Container";
import { FileViewer } from "../../components/FileViewer";
import { PageLoader } from "../../components/PageLoader";
import { Title } from "../../components/Title";

export default function File() {
  const router = useRouter();
  const fileId = router.query.fileId;
  const initialData = router.query.file && JSON.parse(router.query.file as string);
  const file = useSWR<APIFile>(`/f/${fileId}/metadata`, { initialData });
  if (file.error) {
    return (
      <ContainerCenter>
        <h1>{file.error.status}</h1>
        <p>{file.error.text}</p>
      </ContainerCenter>
    );
  }

  if (!file.data) {
    return <PageLoader />;
  }

  return (
    <ContainerCenter>
      <Title>{file.data.name}</Title>
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
