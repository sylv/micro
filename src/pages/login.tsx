import Router from "next/router";
import { useEffect, useState } from "react";
import { Container } from "../components/container";
import { LoginData, LoginForm } from "../components/login-form";
import { Title } from "../components/title";
import { useToasts } from "../hooks/useToasts";
import { login, useUser } from "../hooks/useUser";

export default function Login() {
  const setToast = useToasts();
  const [loading, setLoading] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (user.data) Router.replace("/dashboard");
  }, [user]);

  useEffect(() => {
    Router.prefetch("/dashboard");
  });

  async function onContinue(data: LoginData) {
    try {
      setLoading(true);
      await login(data);
    } catch (err) {
      if (err.status === 401) setToast({ error: true, text: "Your username or password was incorrect." });
      else setToast({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container center small>
      <Title>Sign in</Title>
      <h1 className="my-5 text-4xl font-bold">Sign In</h1>
      <LoginForm buttonText="Sign In" loading={loading} onContinue={onContinue} />
    </Container>
  );
}
