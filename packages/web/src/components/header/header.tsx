import clsx from "clsx";
import { Fragment, memo, useRef, useState } from "react";
import { FiCrop } from "react-icons/fi";
import { useAsync } from "../../hooks/useAsync";
import { useConfig } from "../../hooks/useConfig";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { usePaths } from "../../hooks/usePaths";
import { useUser } from "../../hooks/useUser";
import { Button, ButtonStyle } from "../button";
import { Container } from "../container";
import { Input } from "../input/input";
import { Link } from "../link";
import { useToasts } from "../toast";
import { HeaderUser } from "./header-user";
import { graphql } from "../../@generated/gql";
import { useErrorMutation } from "../../hooks/useErrorMutation";

const ResendVerificationEmail = graphql(`
  mutation ResendVerificationEmail($data: ResendVerificationEmailDto) {
    resendVerificationEmail(data: $data)
  }
`);

export const Header = memo(() => {
  const user = useUser();
  const paths = usePaths();
  const config = useConfig();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const emailInputRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const createToast = useToasts();
  const [resent, setResent] = useState(false);
  const classes = clsx(
    "relative z-20 flex items-center justify-between h-16 my-auto transition",
    paths.loading && "pointer-events-none invisible",
  );

  useOnClickOutside(emailInputRef, () => {
    if (email) return;
    setShowEmailInput(false);
  });

  const [, resendMutation] = useErrorMutation(ResendVerificationEmail, false);
  const [resendVerification, sendingVerification] = useAsync(async () => {
    if (resent || !user.data) return;
    if (!user.data.email && !email) {
      setShowEmailInput(true);
      return;
    }

    const payload = !user.data.email && email ? { email } : null;
    try {
      await resendMutation({
        data: payload,
      });

      setShowEmailInput(false);
      setResent(true);
    } catch (error: any) {
      if (error.message.includes("You can only") || error.message.includes("You have already")) {
        createToast({
          text: "You have already requested a verification email. Please check your inbox, or try resend in 5 minutes.",
          error: true,
        });
        return;
      }

      throw error;
    }
  });

  return (
    <Fragment>
      {user.data && !user.data.verifiedEmail && config.data?.requireEmails && (
        <div className="bg-purple-500 py-2 text-white shadow-2xl">
          <Container>
            <span className="relative">
              You must verify your email before you can upload files.{" "}
              <button
                type="button"
                className={resent ? "cursor-default" : "underline"}
                onClick={resendVerification}
                disabled={sendingVerification || resent}
              >
                {resent ? `Verification email sent to ${user.data.email}!` : "Resend verification email"}
              </button>
              {showEmailInput && (
                <div
                  className="absolute bg-dark-100 top-full mt-2 p-3 rounded max-w-md z-20 md:right-0 border border-dark-400"
                  ref={emailInputRef}
                >
                  <h4 className="font-medium leading-6">Missing Email</h4>
                  <p className="text-gray-500 text-sm">
                    Your account was created before this instance required emails. To verify your account,
                    please enter the email you would like your account to be attached to and hit submit.
                  </p>
                  <div className="mt-3 flex gap-2 items-center">
                    <Input
                      value={email}
                      onChange={(event) => setEmail(event.currentTarget.value)}
                      className="flex-grow"
                      placeholder="Email"
                      disabled={sendingVerification}
                    />
                    <Button onClick={resendVerification} className="w-auto">
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </span>
          </Container>
        </div>
      )}
      <Container>
        <nav className={classes}>
          <div className="flex items-center">
            <Link href={paths.home} className="flex">
              <FiCrop className="w-[24px] h-[24px] mr-2 text-primary" /> micro
            </Link>
          </div>
          <div className="flex items-center">
            {user.data ? (
              <HeaderUser userId={user.data.id} username={user.data.username} />
            ) : (
              <Link href={paths.login}>
                <Button style={ButtonStyle.Secondary}>Sign In</Button>
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </Fragment>
  );
});
