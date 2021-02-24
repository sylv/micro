import { GetServerSideProps } from "next";
import Link from "next/link";
import { ContainerCenterSmall } from "../components/Container";
import { Title } from "../components/Title";

export default function Error(props: { message: string; title: string }) {
  return (
    <ContainerCenterSmall>
      <Title>{props.title}</Title>
      <h1 style={{ margin: "0" }}>{props.title}</h1>
      <p>{props.message}</p>
      <Link href="/">Go Home</Link>
    </ContainerCenterSmall>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      title: ctx.query.title ?? ctx.res.statusCode,
      message: ctx.query.message ?? "Internal Server Error",
    },
  };
};
