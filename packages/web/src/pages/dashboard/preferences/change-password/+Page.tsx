import { useMutation } from '@urql/preact';
import type { FC } from 'react';
import { graphql } from '../../../../@generated';
import type { ChangePasswordMutationVariables } from '../../../../@generated/graphql';
import { Breadcrumbs } from '../../../../components/breadcrumbs';
import { Container } from '../../../../components/container';
import { Title } from '../../../../components/title';
import { useToasts } from '../../../../components/toast';
import { PasswordForm } from '../../../../containers/password-form';
import { navigate, prefetch } from '../../../../helpers/routing';
import { useAsync } from '../../../../hooks/useAsync';
import { useUser } from '../../../../hooks/useUser';

const ChangePassword = graphql(`
  mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $oldPassword, newPassword: $newPassword)
  }
`);

export const Page: FC = () => {
  const createToast = useToasts();
  const [, changeInner] = useMutation(ChangePassword);
  const [change] = useAsync(async (values: ChangePasswordMutationVariables) => {
    prefetch('/dashboard/preferences');
    const result = await changeInner(values);
    if (result.data) {
      createToast({ text: 'Your password has been changed.' });
      navigate('/dashboard/preferences');
    } else if (result.error) {
      if (result.error.message.toLowerCase().includes('unauthorized')) {
        createToast({ text: 'Invalid password.' });
        return;
      } else {
        createToast({ text: 'An error occurred changing your password.' });
      }

      throw result.error;
    }
  });

  useUser();

  return (
    <Container>
      <Title>Change Password</Title>
      <div className="flex justify-center top-[40vh]">
        <div className="w-[80vw] md:w-[50vw] lg:w-[30vw]">
          <Breadcrumbs href="/dashboard/preferences" className="mb-4">
            Dashboard / Preferences
          </Breadcrumbs>
          <h1 className="my-5 text-4xl font-bold">Change Password</h1>
          <PasswordForm onSubmit={change} />
        </div>
      </div>
    </Container>
  );
};
