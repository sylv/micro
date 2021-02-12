import Link from "next/link";
import { ContainerCenterSmall } from "../components/Container";
import { Title } from "../components/Title";

export default function NotFound() {
  return (
    <ContainerCenterSmall>
      <Title>Not Found</Title>
      <h1>404</h1>
      <p>That page was deleted or did not exist to begin with.</p>
      <Link href="/">Go Home</Link>
    </ContainerCenterSmall>
  );
}
