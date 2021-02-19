import { Button, Input, Spacer, Text, useToasts } from "@geist-ui/react";
import { Lock, User } from "@geist-ui/react-icons";
import Router from "next/router";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { ContainerCenterSmall } from "../components/Container";
import { Title } from "../components/Title";
import { login, useUser } from "../hooks/useUser";

export default function Login() {
  const [, setToast] = useToasts();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>();
  const disabled = !username || !password || loading;
  const user = useUser();

  useEffect(() => {
    if (user.data) Router.replace("/dashboard");
  }, [user]);

  const onUsernameChange = (evt: ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value);
  const onPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);

  async function onContinueClick() {
    try {
      setLoading(true);
      await login(username, password);
    } catch (err) {
      if (err.status === 401) setToast({ type: "error", text: "Your password was incorrect." });
      else setToast({ type: "error", text: err.message });
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
    <ContainerCenterSmall>
      <Title>Sign in</Title>
      <Text h1>Sign In</Text>
      <Input
        width="100%"
        type="text"
        placeholder="Username"
        icon={<User />}
        onKeyDown={onKeyDown}
        onChange={onUsernameChange}
      />
      <Spacer y={0.4} />
      <Input.Password
        width="100%"
        placeholder="Password"
        icon={<Lock />}
        ref={passwordRef}
        onKeyDown={onKeyDown}
        onChange={onPasswordChange}
      />
      <Spacer y={0.8} />
      <Button className="max-width" type="success" onClick={onContinueClick} onKeyDown={onKeyDown} disabled={disabled}>
        Continue
      </Button>
    </ContainerCenterSmall>
  );
}
