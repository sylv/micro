import { getReasonPhrase, StatusCodes } from "http-status-codes";
import { useRouter } from "next/router";
import { Container } from "../components/container";
import { Link } from "../components/link";
import { Title } from "../components/title";
import { usePaths } from "../hooks/use-paths.helper";

export interface ErrorProps {
  status?: StatusCodes;
  message?: string;
}

const ERROR_LENNIES = ["ಠ_ಠ", "(ಥ﹏ಥ)", "ʕ•ᴥ•ʔ", "≧☉_☉≦", "ლ,ᔑ•ﺪ͟͠•ᔐ.ლ", "( ͡ಠ ʖ̯ ͡ಠ)", "(◉͜ʖ◉)", "¯\\_(⊙_ʖ⊙)_/¯"];
export default function Error(props: ErrorProps) {
  const router = useRouter();
  const status = props.status ?? StatusCodes.INTERNAL_SERVER_ERROR;
  const lenny = ERROR_LENNIES[status % ERROR_LENNIES.length];
  const message = props.message ?? router.query.message ?? getReasonPhrase(status);
  const paths = usePaths();

  return (
    <Container center>
      <Title>Error {status.toString()}</Title>
      <h1 className="mb-4 text-4xl font-fold">{lenny}</h1>
      <p className="text-lg">{message}</p>
      <Link className="text-brand" href={paths.home}>
        Go Home
      </Link>
    </Container>
  );
}
