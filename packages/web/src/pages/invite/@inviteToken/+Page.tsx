import type { FC } from 'react';
import { useEffect } from 'react';
import { graphql } from '../../../@generated/gql';
import { Container } from '../../../components/container';
import { Error } from '../../../components/error';
import { PageLoader } from '../../../components/page-loader';
import { Time } from '../../../components/time';
import { Title } from '../../../components/title';
import { useToasts } from '../../../components/toast';
import type { SignupData } from '../../../containers/signup-form';
import { SignupForm } from '../../../containers/signup-form';
import { getErrorMessage } from '../../../helpers/get-error-message.helper';
import { navigate, prefetch } from '../../../helpers/routing';
import { useAsync } from '../../../hooks/useAsync';
import { useConfig } from '../../../hooks/useConfig';
import type { PageProps } from '../../../renderer/types';
import { useQuery, useMutation } from '@urql/preact';

const GetInvite = graphql(`
  query GetInvite($inviteId: ID!) {
    invite(inviteId: $inviteId) {
      id
      expiresAt
    }
  }
`);

const CreateUser = graphql(`
  mutation CreateUser($user: CreateUserDto!) {
    createUser(data: $user) {
      id
    }
  }
`);

export const Page: FC<PageProps> = ({ routeParams }) => {
  const config = useConfig();
  const createToast = useToasts();
  const inviteToken = routeParams.inviteToken;
  const [invite] = useQuery({ query: GetInvite, pause: !inviteToken, variables: { inviteId: inviteToken! } });
  const expiresAt = invite.data?.invite.expiresAt;

  useEffect(() => {
    prefetch('/login');
  }, []);

  const [, createUserMutation] = useMutation(CreateUser);
  const [onSubmit] = useAsync(async (data: SignupData) => {
    try {
      if (!inviteToken) return;
      await createUserMutation({
        user: {
          ...data,
          invite: inviteToken,
        },
      });

      navigate('/login');
      createToast({ text: 'Account created successfully. Please sign in.' });
    } catch (error) {
      const message = getErrorMessage(error);
      if (message) {
        createToast({ text: message, error: true });
      }
    }
  });

  if (invite.error || config.error) {
    return <Error error={invite.error || config.error} />;
  }

  if (!invite.data || !config.data) {
    return <PageLoader title="You're Invited" />;
  }

  return (
    <Container centerY>
      <Title>You&apos;re Invited</Title>
      <h1 className="text-4xl font-bold text-center mb-6 md:hidden">Sign Up</h1>
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
};
