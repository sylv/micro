import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { Fragment, useCallback, useEffect } from 'react';
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

  return (
    <Fragment>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={schema}
        onSubmit={async (values) => {
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
