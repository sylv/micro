import { FC } from 'react';
import { getErrorMessage } from '../helpers/get-error-message.helper';
import { usePaths } from '../hooks/usePaths';
import { Container } from './container';
import { Link } from './link';
import { Title } from './title';

export enum Lenny {
  Concerned = 'ಠ_ಠ',
  Crying = '(ಥ﹏ಥ)',
  Bear = 'ʕ•ᴥ•ʔ',
  Kawaii = '≧☉_☉≦',
  Wut = 'ლ,ᔑ•ﺪ͟͠•ᔐ.ლ',
  Happy = '(◉͜ʖ◉)',
  Shrug = '¯\\_(⊙_ʖ⊙)_/¯',
  Angry = "(ง'̀-'́)ง",
}

export type ErrorProps = ({ error: unknown } | { message: string }) & { lenny?: Lenny };

export const Error: FC<ErrorProps> = (props) => {
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
};
