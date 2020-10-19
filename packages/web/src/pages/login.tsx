import { Button, Checkbox, Input, Spacer, Text, useToasts } from "@geist-ui/react";
import { Lock, User } from "@geist-ui/react-icons";
import Router from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import { Title } from "../components/Title";
import { login, useUser } from "../hooks/useUser";

const LoginContainer = styled.div`
  width: 100%;
  max-width: 240px;
  padding: 15px;
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default function Login() {
  const [, setToast] = useToasts();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(true);
  const disabled = !username || !password;
  const { user } = useUser();

  useEffect(() => {
    if (user) Router.replace("/dashboard");
  }, [user]);

  const toggleRemember = () => setRemember((state) => !state);
  const onUsernameChange = (evt: ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value);
  const onPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);

  async function onContinueClick() {
    try {
      await login(username, password, remember);
    } catch (err) {
      setToast({ type: "error", text: err.message });
    }
  }

  return (
    <>
      <Title>Sign in</Title>
      <LoginContainer>
        <Text h1>Sign In</Text>
        <Input
          width="100%"
          type="text"
          placeholder="Username"
          icon={<User />}
          onChange={onUsernameChange}
        />
        <Spacer y={0.4} />
        <Input.Password
          width="100%"
          placeholder="Password"
          icon={<Lock />}
          onChange={onPasswordChange}
        />
        <Spacer y={0.8} />
        <Checkbox initialChecked={remember} onChange={toggleRemember}>
          Remember me
        </Checkbox>
        <Spacer y={0.8} />
        <Button className="max-width" type="success" onClick={onContinueClick} disabled={disabled}>
          Continue
        </Button>
      </LoginContainer>
    </>
  );
}
