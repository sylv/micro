import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container } from '../components/container';
import type { LoginData } from '../components/login-form';
import { LoginForm } from '../components/login-form';
import { Title } from '../components/title';
import { useAsync } from '../hooks/useAsync';
import { useToasts } from '../hooks/useToasts';
import { useUser } from '../hooks/useUser';

export default function Login() {
  const createToast = useToasts();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.data) {
      const url = new URL(window.location.href);
      const to = url.searchParams.get('to') ?? '/dashboard';
      Router.replace(to);
    }
  }, [user]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const verified = url.searchParams.get('verified');
    if (verified) {
      createToast({
        text: 'Your account has been verified.',
      });
    }
  }, []);

  const [login, loggingIn] = useAsync(async (data: LoginData) => {
    await user.login(data);
    const url = new URL(window.location.href);
    const to = url.searchParams.get('to') ?? '/dashboard';
    router.push(to);
  });

  return (
    <Container center small>
      <Title>Sign in</Title>
      <h1 className="my-5 text-4xl font-bold">Sign In</h1>
      <LoginForm buttonText="Sign In" loading={loggingIn} onContinue={login} emailPrompt={false} />
    </Container>
  );
}
