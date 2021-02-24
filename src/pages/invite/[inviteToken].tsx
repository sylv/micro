import { useRouter } from "next/router";
import useSWR from "swr";
import { ContainerCenter, ContainerCenterSmall } from "../../components/Container";
import { PageLoader } from "../../components/PageLoader";
import { Title } from "../../components/Title";
import { Lock, User } from "@geist-ui/react-icons";
import { Input, Spacer, Button, useToasts } from "@geist-ui/react";
import { ChangeEvent, useState } from "react";
import { http } from "../../helpers/http";
import Router from "next/router";
import { GetInviteData } from "../../types";
import { Endpoints } from "../../constants";
import Error from "../_error";

export default function Invite() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setToast] = useToasts();
  const disabled = loading || !username || !password;
  const inviteToken = router.query.inviteToken;
  const initialData = router.query.invite && JSON.parse(router.query.invite as string);
  const invite = useSWR<GetInviteData>(`/api/invite/${inviteToken}`, { initialData });
  if (invite.error) {
    return <Error title={invite.error.status} message={invite.error.text} />;
  }

  if (!invite.data) {
    return <PageLoader />;
  }

  const onUsernameChange = (evt: ChangeEvent<HTMLInputElement>) => setUsername(evt.target.value);
  const onPasswordChange = (evt: ChangeEvent<HTMLInputElement>) => setPassword(evt.target.value);
  const onSubmit = async () => {
    try {
      setLoading(true);
      await http(Endpoints.USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, invite: inviteToken }),
      });

      Router.push("/login");
      setToast({ type: "success", text: "Account created successfully. Please sign in." });
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerCenterSmall>
      <Title>You're Invited</Title>
      <h1>Sign Up</h1>
      <Input width="100%" type="text" placeholder="Username" icon={<User />} onChange={onUsernameChange} />
      <Spacer y={0.4} />
      <Input.Password width="100%" placeholder="Password" icon={<Lock />} onChange={onPasswordChange} />
      <Spacer y={0.8} />
      <Button className="max-width" type="success" disabled={disabled} onClick={onSubmit}>
        Create Account
      </Button>
    </ContainerCenterSmall>
  );
}

// without this router.query.invite does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
