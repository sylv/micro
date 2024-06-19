import clsx from "clsx";
import { Form, Formik } from "formik";
import type { FC } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import { Input } from "../components/input/input";
import { OtpInput } from "../components/input/otp";
import { Submit } from "../components/input/submit";
import { useAsync } from "../hooks/useAsync";
import { RegularUser, useUser } from "../hooks/useUser";
import { getErrorMessage } from "../helpers/get-error-message.helper";
import { Warning, WarningType } from "../components/warning";
import { useErrorMutation } from "../hooks/useErrorMutation";
import { navigate } from "vike/client/router";
import { graphql, type VariablesOf } from "../graphql";

const schema = Yup.object().shape({
  username: Yup.string().required().min(2),
  password: Yup.string().required().min(5),
});

const LoginMutation = graphql(
  `
  mutation Login($username: String!, $password: String!, $otp: String) {
    login(username: $username, password: $password, otpCode: $otp) {
      ...RegularUser
    }
  }
`,
  [RegularUser],
);

export const LoginForm: FC = () => {
  const user = useUser();
  const [loginInfo, setLoginInfo] = useState<VariablesOf<typeof LoginMutation> | null>(null);
  const [invalidOTP, setInvalidOTP] = useState(false);
  const [disabledReason, setDisabledReason] = useState<string | null>(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirect = useCallback(() => {
    const url = new URL(window.location.href);
    const to = url.searchParams.get("to") ?? "/dashboard";
    navigate(to);
  }, []);

  useEffect(() => {
    if (user.data) {
      // redirect if the user is already signed in
      redirect();
    }
  }, [user, redirect]);

  const [, loginMutation] = useErrorMutation(LoginMutation, false);
  const [login, loggingIn] = useAsync(async (values: VariablesOf<typeof LoginMutation>) => {
    setLoginInfo(values);
    setInvalidOTP(false);

    try {
      await loginMutation(values);
      setError(null);
      redirect();
    } catch (error: any) {
      if (error.message.toLowerCase().includes("otp")) {
        setOtpRequired(true);
      }

      if (otpRequired && error.message.toLowerCase().includes("invalid otp")) {
        setInvalidOTP(true);
      } else if (error.message.includes("ACCOUNT_DISABLED")) {
        const index = error.message.indexOf(":");
        const message = error.message.slice(index + 1);
        setDisabledReason(message);
      } else if (error.message.toLowerCase().includes("unauthorized")) {
        setError("Invalid username or password");
      } else if (error.message.startsWith("ACCOUNT_DISABLED:")) {
        const message = error.message.replace("ACCOUNT_DISABLED: ", "");
        setError(message);
      } else {
        const message = getErrorMessage(error);
        setError(message || "An unknown error occured.");
      }
    }
  });

  if (disabledReason) {
    return (
      <Warning type={WarningType.Error} className="w-full">
        <div>
          <h3>Your account is disabled</h3>
          <p className="font-mono">{disabledReason}</p>
        </div>
      </Warning>
    );
  }

  if (otpRequired && loginInfo) {
    return (
      <div className="w-full">
        <OtpInput
          loading={loggingIn}
          invalid={invalidOTP}
          onCode={(otp) => {
            login({ ...loginInfo, otp });
          }}
        />
        <span
          className={clsx(
            "absolute mt-2 text-xs text-center font-mono",
            invalidOTP ? "text-red-400" : "text-gray-600",
          )}
        >
          {invalidOTP ? "Invalid OTP code" : "Enter the OTP code from your authenticator app"}
        </span>
      </div>
    );
  }

  return (
    <Fragment>
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values) => {
          await login(values);
        }}
      >
        <Form>
          <Input
            id="username"
            type="username"
            placeholder="Username or email"
            autoComplete="username"
            autoFocus
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="mt-2"
          />
          <Submit className="mt-4 w-full" type="submit">
            Sign In
          </Submit>
          {error && <span className="absolute mt-2 text-xs text-center text-red-400 font-mono">{error}</span>}
        </Form>
      </Formik>
    </Fragment>
  );
};
