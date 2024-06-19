import type { FC } from "react";
import { useEffect } from "react";
import { Container } from "../../components/container";
import { createToast } from "../../components/toast/store";
import { LoginForm } from "../../containers/login-form";

export const title = "Sign In — micro";

export const Page: FC = () => {
  useEffect(() => {
    // show a verification toast if the user has
    // completed verification
    const url = new URL(window.location.href);
    const verified = url.searchParams.get("verified");
    if (verified) {
      createToast({
        message: "Your account has been verified.",
      });
    }
  }, [createToast]);

  return (
    <Container center small>
      <h1 className="my-5 text-4xl font-bold">Sign In</h1>
      <LoginForm />
    </Container>
  );
};
