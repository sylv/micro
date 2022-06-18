import { GetInviteData } from "@ryanke/micro-api";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Container } from "../../components/container";
import { LoginData, LoginForm } from "../../components/login-form";
import { PageLoader } from "../../components/page-loader";
import { Time } from "../../components/time";
import { Title } from "../../components/title";
import { getErrorMessage } from "../../helpers/get-error-message.helper";
import { http } from "../../helpers/http.helper";
import { useToasts } from "../../hooks/use-toasts.helper";
import Error from "../_error";

export default function Invite() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const setToast = useToasts();
  const inviteToken = router.query.inviteToken;
  const invite = useSWR<GetInviteData>(inviteToken ? `/api/invite/${inviteToken}` : null);
  const expiresAt = invite.data?.expiresAt;

  useEffect(() => {
    Router.prefetch("/login");
  }, []);

  if (invite.error) {
    return <Error status={invite.error.status} message={invite.error.text} />;
  }

  if (!invite.data) {
    return <PageLoader title="You're Invited" />;
  }

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      await http(`user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, invite: inviteToken }),
      });

      Router.push("/login");
      setToast({ text: "Account created successfully. Please sign in." });
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? "An unknown error occurred.";
      setToast({ error: true, text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerY>
      <Title>You&apos;re Invited</Title>
      <h1 className="text-4xl font-bold text-center md:hidden">Sign Up</h1>
      {expiresAt && (
        <p className="mt-2 mb-2 text-xs text-center text-gray-600 md:hidden">
          This invite will expire <Time date={expiresAt} />.
        </p>
      )}
      <div className="grid flex-row-reverse grid-cols-6 gap-12">
        <div className="col-span-6 md:col-span-2">
          <LoginForm buttonText="Create Account" onContinue={onSubmit} loading={loading} />
        </div>
        <div className="flex-col justify-center hidden col-span-6 md:flex md:col-span-4">
          <h1 className="mb-2 text-4xl font-bold">Welcome to Micro</h1>
          <p>
            You have been invited to try out micro, an invite-only file sharing service with support for ShareX. Create
            an account, then download the ShareX config and start uploading with your favourite vanity domain.
          </p>
          {expiresAt && (
            <p className="mt-2 text-xs text-gray-600">
              This invite will expire <Time date={expiresAt} />.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
