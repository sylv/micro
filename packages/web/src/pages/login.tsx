import { Container, useToasts } from '@ryanke/pandora';
import { useEffect } from 'react';
import { Title } from '../components/title';
import { LoginForm } from '../containers/login-form';

export default function Login() {
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
}
