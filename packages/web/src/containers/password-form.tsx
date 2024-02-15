import { Form, Formik } from 'formik';
import type { FC } from 'react';
import { Fragment } from 'react';
import * as Yup from 'yup';
import { Input } from '../components/input/input';
import { Submit } from '../components/input/submit';

interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

interface PasswordFormProps {
  onSubmit: (data: PasswordData) => Promise<void> | void;
}

const schema = Yup.object().shape({
  oldPassword: Yup.string().required().min(5),
  newPassword: Yup.string().required().min(5),
});

export const PasswordForm: FC<PasswordFormProps> = ({ onSubmit }) => {
  return (
    <Fragment>
      <Formik
        validationSchema={schema}
        initialValues={{
          oldPassword: '',
          newPassword: '',
        }}
        onSubmit={async (values) => {
          await onSubmit(values);
        }}
      >
        <Form className="space-y-2">
          <Input id="oldPassword" type="password" placeholder="Current Password" autoComplete="current-password" />
          <Input id="newPassword" type="password" placeholder="New Password" autoComplete="new-password" />
          <Submit className="mt-4 w-full" type="submit">
            Change Password
          </Submit>
        </Form>
      </Formik>
    </Fragment>
  );
};
