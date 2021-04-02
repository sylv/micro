import { GetServerSideProps } from "next";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { Title } from "../components/Title";

export default function Error(props: { message: string; title: string }) {
  return (
    <Container small center>
      <Title>{props.title}</Title>
      <h1 className="mb-2 text-5xl font-bold">{props.title}</h1>
      <p className="mb-2 text-lg">{props.message}</p>
      <Link className="text-brand" href="/">
        Go Home
      </Link>
    </Container>
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
