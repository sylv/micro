import { useRouter } from "next/router";
import useSWR from "swr";
import { Container } from "../../components/Container";
import { FileEmbed } from "../../components/FileEmbed";
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
    <Container center>
      <Title>{file.data.displayName}</Title>
      <FileEmbed file={file.data}></FileEmbed>
    </Container>
  );
}

// without this router.query.file does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
