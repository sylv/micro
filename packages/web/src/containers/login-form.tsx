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

const schema = Yup.object().shape({
  username: Yup.string().required().min(2),
  password: Yup.string().required().min(5),
});

export const LoginForm: FC = () => {
  const user = useUser();
  const [loginInfo, setLoginInfo] = useState<LoginMutationVariables | null>(null);
  const [invalidOTP, setInvalidOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    try {
      setLoginInfo(values);
      setInvalidOTP(false);
      await user.login(values);
      console.log('ball');
      setError(null);
      redirect();
    } catch (error: any) {
      console.log(error);
      if (user.otpRequired && error.message.toLowerCase().includes('invalid otp')) {
        setInvalidOTP(true);
        return;
      } else if (error.message.toLowerCase().includes('unauthorized')) {
        setError('Invalid username or password');
        return;
      }

      throw error;
    }
  });

  if (user.otpRequired && loginInfo) {
    return (
      <div>
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
