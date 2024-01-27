import { FC, useEffect } from 'react';
import { Title } from '../../components/title';
import { LoginForm } from '../../containers/login-form';
import { Container } from '../../components/container';
import { useToasts } from '../../components/toast';

export const Page: FC = () => {
  const createToast = useToasts();

  useEffect(() => {
    // show a verification toast if the user has
    // completed verification
    const url = new URL(window.location.href);
    const verified = url.searchParams.get('verified');
    if (verified) {
      createToast({
        text: 'Your account has been verified.',
      });
    }
  }, [createToast]);

  return (
    <Container center small>
      <Title>Sign in</Title>
      <h1 className="my-5 text-4xl font-bold">Sign In</h1>
      <LoginForm />
    </Container>
  );
};
