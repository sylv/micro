import { useAsync } from '@ryanke/pandora';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { OtpInput } from 'src/components/input/otp';
import type { LoginMutationVariables } from 'src/generated/graphql';
import * as Yup from 'yup';
import { Input } from '../components/input/input';
import { Submit } from '../components/input/submit';
import { useUser } from '../hooks/useUser';

const schema = Yup.object().shape({
  username: Yup.string().required().min(2),
  password: Yup.string().required().min(5),
});

export const LoginForm: FC = () => {
  const user = useUser();
  const router = useRouter();
  const [loginInfo, setLoginInfo] = useState<LoginMutationVariables | null>(null);
  const [invalidOTP, setInvalidOTP] = useState(false);
  const redirect = useCallback(() => {
    const url = new URL(window.location.href);
    const to = url.searchParams.get('to') ?? '/dashboard';
    router.replace(to);
  }, [router]);

  useEffect(() => {
    if (user.data) {
      // redirect if the user is already signed in
      redirect();
    }
  }, [user, router, redirect]);

  const [login, loggingIn] = useAsync(async (values: LoginMutationVariables) => {
    try {
      setInvalidOTP(false);
      await user.login(values);
      redirect();
    } catch (error: any) {
      if (user.otpRequired && error.message.toLowerCase().includes('invalid otp')) {
        setInvalidOTP(true);
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
        <span className={clsx(`text-xs text-center`, invalidOTP ? 'text-red-400' : 'text-gray-600')}>
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
          setLoginInfo(values);
          await user.login(values);
          redirect();
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
          <Submit className="mt-4" type="submit">
            Sign In
          </Submit>
        </Form>
      </Formik>
    </Fragment>
  );
};
