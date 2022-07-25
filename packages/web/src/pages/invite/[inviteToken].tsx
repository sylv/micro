import { Container, useAsync, useToasts } from '@ryanke/pandora';
import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import { PageLoader } from '../../components/page-loader';
import { Time } from '../../components/time';
import { Title } from '../../components/title';
import type { SignupData } from '../../containers/signup-form';
import { SignupForm } from '../../containers/signup-form';
import { useCreateUserMutation, useGetInviteQuery } from '../../generated/graphql';
import { getErrorMessage } from '../../helpers/get-error-message.helper';
import { useConfig } from '../../hooks/useConfig';
import ErrorPage from '../_error';

export default function Invite() {
  const config = useConfig();
  const router = useRouter();
  const createToast = useToasts();
  const inviteToken = router.query.inviteToken as string | undefined;
  const invite = useGetInviteQuery({ skip: !inviteToken, variables: { inviteId: inviteToken! } });
  const expiresAt = invite.data?.invite.expiresAt;

  useEffect(() => {
    Router.prefetch('/login');
  }, []);

  const [createUserMutation] = useCreateUserMutation();
  const [onSubmit] = useAsync(async (data: SignupData) => {
    try {
      if (!inviteToken) return;
      await createUserMutation({
        variables: {
          user: {
            ...data,
            invite: inviteToken,
          },
        },
      });

      Router.push('/login');
      createToast({ text: 'Account created successfully. Please sign in.' });
    } catch (error) {
      const message = getErrorMessage(error);
      if (message) {
        createToast({ text: message, error: true });
      }
    }
  });

  if (invite.error || config.error) {
    return <ErrorPage error={invite.error || config.error} />;
  }

  if (!invite.data || !config.data) {
    return <PageLoader title="You're Invited" />;
  }

  return (
    <Container centerY>
      <Title>You&apos;re Invited</Title>
      <h1 className="text-4xl font-bold text-center md:hidden">Sign Up</h1>
      {expiresAt && (
        <p className="mt-2 mb-2 text-xs text-center text-gray-600 md:hidden">
          This invite will expire <Time date={expiresAt} />.
        </p>
      )}
      <div className="grid flex-row-reverse grid-cols-6 gap-12">
        <div className="col-span-6 md:col-span-2">
          <SignupForm onSubmit={onSubmit} />
        </div>
        <div className="flex-col justify-center hidden col-span-6 md:flex md:col-span-4">
          <h1 className="mb-2 text-4xl font-bold">Welcome to Micro</h1>
          <p>
            You have been invited to try out micro, an invite-only file sharing service with support for ShareX. Create
            an account, then download the ShareX config and start uploading with your favourite vanity domain.
          </p>
          {expiresAt && (
            <p className="mt-2 text-xs text-gray-600">
              This invite will expire <Time date={expiresAt} />.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}
