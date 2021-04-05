import Router, { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Key, User } from "react-feather";
import useSWR from "swr";
import { Button } from "../../components/Button";
import { Container } from "../../components/Container";
import { Input } from "../../components/Input";
import { PageLoader } from "../../components/PageLoader";
import { Time } from "../../components/Time";
import { Title } from "../../components/Title";
import { Endpoints } from "../../constants";
import { http } from "../../helpers/http";
import { useToasts } from "../../hooks/useToasts";
import { GetInviteData } from "../../types";
import Error from "../_error";

export default function Invite() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setToast = useToasts();
  const disabled = loading || !username || !password;
  const inviteToken = router.query.inviteToken;
  const initialData = router.query.invite && JSON.parse(router.query.invite as string);
  const invite = useSWR<GetInviteData>(`/api/invite/${inviteToken}`, { initialData });
  const expiry = invite.data ? invite.data.exp * 1000 : 0;

  useEffect(() => {
    Router.prefetch("/login");
  }, []);

  if (invite.error) {
    return <Error status={invite.error.status} message={invite.error.text} />;
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
      setToast({ text: "Account created successfully. Please sign in." });
    } catch (err) {
      setToast({ error: true, text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerY>
      <Title>You're Invited</Title>
      <h1 className="text-4xl font-bold text-center md:hidden">Sign Up</h1>
      <p className="mt-2 mb-2 text-xs text-center text-gray-600 md:hidden">
        This invite will expire <Time date={expiry} />.
      </p>
      <div className="grid flex-row-reverse grid-cols-6 gap-12">
        <div className="col-span-6 md:col-span-2">
          <Input type="text" placeholder="Username" prefix={<User />} onChange={onUsernameChange} className="mt-2" />
          <Input type="password" placeholder="Password" className="mt-2" prefix={<Key />} onChange={onPasswordChange} />
          <Button type="primary" disabled={disabled} onClick={onSubmit} className="mt-4">
            Create Account
          </Button>
        </div>
        <div className="flex-col justify-center hidden col-span-6 md:flex md:col-span-4">
          <h1 className="mb-2 text-4xl font-bold">Welcome to Micro</h1>
          <p>
            You've been invited to try out micro, an invite-only file sharing service with support for ShareX. Create an
            account, then download the ShareX config and start uploading with your favourite vanity domain.
          </p>
          <p className="mt-2 text-xs text-gray-600">
            This invite will expire <Time date={expiry} />.
          </p>
        </div>
      </div>
    </Container>
  );
}

// without this router.query.invite does not exist
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
