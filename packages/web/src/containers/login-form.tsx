import clsx from 'clsx';
import { Form, Formik } from 'formik';
import type { FC } from 'react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import type { LoginMutationVariables } from '../@generated/graphql';
import { Input } from '../components/input/input';
import { OtpInput } from '../components/input/otp';
import { Submit } from '../components/input/submit';
import { navigate } from '../helpers/routing';
import { useAsync } from '../hooks/useAsync';
import { useUser } from '../hooks/useUser';
import { useMutation } from '@urql/preact';
import { graphql } from '../@generated';
import { getErrorMessage } from '../helpers/get-error-message.helper';
import { Warning, WarningType } from '../components/warning';

const schema = Yup.object().shape({
  username: Yup.string().required().min(2),
  password: Yup.string().required().min(5),
});

const LoginMutation = graphql(`
  mutation Login($username: String!, $password: String!, $otp: String) {
    login(username: $username, password: $password, otpCode: $otp) {
      ...RegularUser
    }
  }
`);

export const LoginForm: FC = () => {
  const user = useUser();
  const [loginInfo, setLoginInfo] = useState<LoginMutationVariables | null>(null);
  const [invalidOTP, setInvalidOTP] = useState(false);
  const [disabledReason, setDisabledReason] = useState<string | null>(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, loginMutation] = useMutation(LoginMutation);
  const redirect = useCallback(() => {
    const url = new URL(window.location.href);
    const to = url.searchParams.get('to') ?? '/dashboard';
    navigate(to);
  }, []);

  useEffect(() => {
    if (user.data) {
      // redirect if the user is already signed in
      redirect();
    }
  }, [user, redirect]);

  const [login, loggingIn] = useAsync(async (values: LoginMutationVariables) => {
    setLoginInfo(values);
    setInvalidOTP(false);

    // i truly do not understand why this doesn't just throw.
    const result = await loginMutation(values);
    if (result.error) {
      if (result.error.message.toLowerCase().includes('otp')) {
        setOtpRequired(true);
      }

      if (otpRequired && result.error.message.toLowerCase().includes('invalid otp')) {
        setInvalidOTP(true);
      } else if (result.error.message.includes('ACCOUNT_DISABLED')) {
        const index = result.error.message.indexOf(':');
        const message = result.error.message.slice(index + 1);
        setDisabledReason(message);
      } else if (result.error.message.toLowerCase().includes('unauthorized')) {
        setError('Invalid username or password');
      } else if (result.error.message.startsWith('ACCOUNT_DISABLED:')) {
        const message = result.error.message.replace('ACCOUNT_DISABLED: ', '');
        setError(message);
      } else {
        const message = getErrorMessage(result.error);
        setError(message || 'An unknown error occured.');
      }

      return;
    }

    setError(null);
    redirect();
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
          className={clsx(`absolute mt-2 text-xs text-center font-mono`, invalidOTP ? 'text-red-400' : 'text-gray-600')}
        >
          {invalidOTP ? 'Invalid OTP code' : 'Enter the OTP code from your authenticator app'}
        </span>
      </div>
    );
  }

  return (
    <Fragment>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values) => {
          await login(values);
        }}
      >
        <Form>
          <Input id="username" type="username" placeholder="Username or email" autoComplete="username" autoFocus />
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
