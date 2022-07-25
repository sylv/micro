import { Container } from '@ryanke/pandora';
import { Link } from '../components/link';
import { Title } from '../components/title';
import { getErrorMessage } from '../helpers/get-error-message.helper';
import { usePaths } from '../hooks/usePaths';

export enum Lenny {
  Concerned = 'ಠ_ಠ',
  Crying = '(ಥ﹏ಥ)',
  Bear = 'ʕ•ᴥ•ʔ',
  Kawaii = '≧☉_☉≦',
  Wut = 'ლ,ᔑ•ﺪ͟͠•ᔐ.ლ',
  Happy = '(◉͜ʖ◉)',
  Shrug = '¯\\_(⊙_ʖ⊙)_/¯',
}

export type ErrorProps = ({ error: unknown } | { message: string }) & { lenny?: Lenny };

export default function Error(props: ErrorProps) {
  const message = 'message' in props ? props.message : getErrorMessage(props.error) || 'An unknown error occurred.';
  const paths = usePaths();
  const lenny = props.lenny ?? Lenny.Wut;

  return (
    <Container center>
      <Title>{message}</Title>
      <h1 className="mb-4 text-4xl font-fold">{lenny}</h1>
      <p className="text-lg">{message}</p>
      <Link className="text-primary" href={paths.home}>
        Go Home
      </Link>
    </Container>
  );
}
