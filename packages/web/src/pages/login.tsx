import Router from "next/router";
import { useEffect, useState } from "react";
import { Container } from "../components/container";
import { LoginData, LoginForm } from "../components/login-form";
import { Title } from "../components/title";
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { HTTPError } from "../helpers/http.helper";
import { useToasts } from "../hooks/use-toasts.helper";
import { login, useUser } from "../hooks/use-user.helper";

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
    } catch (error: unknown) {
      if (error instanceof HTTPError && error.status === 401) {
        setToast({ error: true, text: "Your username or password was incorrect." });
      } else {
        const message = getErrorMessage(error) ?? "An unknown error occured.";
        setToast({ error: true, text: message });
      }
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
