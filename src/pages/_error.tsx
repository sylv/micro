import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { Title } from "../components/Title";

const ERROR_LENNIES = ["ಠ_ಠ", "(ಥ﹏ಥ)", "ʕ•ᴥ•ʔ", "≧☉_☉≦", "ლ,ᔑ•ﺪ͟͠•ᔐ.ლ", "( ͡ಠ ʖ̯ ͡ಠ)", "(◉͜ʖ◉)", "¯\\_(⊙_ʖ⊙)_/¯"];

export default function Error(props: { status?: StatusCodes; message?: string }) {
  const router = useRouter();
  const status = props.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const lenny = ERROR_LENNIES[status % ERROR_LENNIES.length];
  const message = props.message ?? router.query.message ?? getReasonPhrase(status);

  return (
    <Container center>
      <Title>Error {status}</Title>
      <h1 className="mb-4 text-4xl font-fold">{lenny}</h1>
      <p className="text-lg">{message}</p>
      <Link className="text-brand" href="/">
        Go Home
      </Link>
    </Container>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return {
    props: {
      status: ctx.res?.statusCode,
      message: ctx.query.message,
    },
  };
};
