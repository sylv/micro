import Router from "next/router";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Input } from "../components/Input";
import { Title } from "../components/Title";
import { useToasts } from "../hooks/useToasts";
import { login, useUser } from "../hooks/useUser";

export default function Login() {
  const setToast = useToasts();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const disabled = !username || !password || loading;
  const user = useUser();

  useEffect(() => {
    if (user.data) Router.replace("/dashboard");
  }, [user]);

  useEffect(() => {
    Router.prefetch("/dashboard");
  });

  const onUsernameChange = (evt: ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value);
  const onPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);

  async function onContinueClick() {
    try {
      setLoading(true);
      await login(username, password);
    } catch (err) {
      if (err.status === 401) setToast({ error: true, text: "Your password was incorrect." });
      else setToast({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const onKeyDown = (event: KeyboardEvent<any>) => {
    if (event.key !== "Enter") return;
    if (disabled) {
      if (!password) passwordRef.current?.focus();
      return;
    }

    onContinueClick();
  };

  return (
    <Container center small>
      <Title>Sign in</Title>
      <h1 className="my-5 text-4xl font-bold">Sign In</h1>
      <Input placeholder="Username" onKeyDown={onKeyDown} onChange={onUsernameChange} />
      <Input
        className="mt-2"
        type="password"
        placeholder="Password"
        onKeyDown={onKeyDown}
        onChange={onPasswordChange}
      />
      <Button className="mt-4" type="primary" onClick={onContinueClick} onKeyDown={onKeyDown} disabled={disabled}>
        Continue
      </Button>
    </Container>
  );
}
