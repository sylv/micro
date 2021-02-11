import Link from "next/link";
import { ContainerCenter } from "../components/Container";

export default function NotFound() {
  return (
    <ContainerCenter>
      <h1>404</h1>
      <p>That page does not exist.</p>
      <Link href="/">Go Home</Link>
    </ContainerCenter>
  );
}
