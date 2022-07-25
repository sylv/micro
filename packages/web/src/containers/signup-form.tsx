import { Form, Formik } from 'formik';
import type { FC } from 'react';
import { Fragment, useMemo } from 'react';
import * as Yup from 'yup';
import { Input } from '../components/input/input';
import { Submit } from '../components/input/submit';
import { useConfig } from '../hooks/useConfig';

export interface SignupData {
  email?: string;
  username: string;
  password: string;
}

export interface SignupFormProps {
  onSubmit: (data: SignupData) => Promise<void> | void;
}

export const SignupForm: FC<SignupFormProps> = ({ onSubmit }) => {
  const config = useConfig();
  const schema = useMemo(() => {
    const email = config.data?.requireEmails ? Yup.string().email().required() : Yup.string().optional();
    return Yup.object().shape({
      username: Yup.string().required().min(2),
      password: Yup.string().required().min(5),
      email: email,
    });
  }, [config.data]);

  return (
    <Fragment>
      <Formik
        validationSchema={schema}
        initialValues={{
          username: '',
          password: '',
          email: '' as string | undefined,
        }}
        onSubmit={async (values) => {
          if (!config.data?.requireEmails) delete values.email;
          await onSubmit(values);
        }}
      >
        <Form className="space-y-2">
          {config.data?.requireEmails && <Input id="email" type="email" placeholder="Email" autoFocus />}
          <Input id="username" type="username" placeholder="Username" autoComplete="username" />
          <Input id="password" type="password" placeholder="Password" autoComplete="new-password" />
          <Submit className="mt-4" type="submit">
            Sign Up
          </Submit>
        </Form>
      </Formik>
    </Fragment>
  );
};
