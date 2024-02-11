import { FC, Fragment } from 'react';
import { useMutation, useQuery } from 'urql';
import { graphql } from '../../../@generated';
import { Breadcrumbs } from '../../../components/breadcrumbs';
import { Button } from '../../../components/button';
import { Container } from '../../../components/container';
import { Input } from '../../../components/input/input';
import { OtpInput } from '../../../components/input/otp';
import { ButtonSkeleton, InputSkeleton, Skeleton } from '../../../components/skeleton';
import { Title } from '../../../components/title';
import { ConfigGenerator } from '../../../containers/config-generator/config-generator';
import { navigate } from '../../../helpers/routing';
import { useAsync } from '../../../hooks/useAsync';
import { useLogoutUser, useUserRedirect } from '../../../hooks/useUser';

const RefreshToken = graphql(`
  mutation RefreshToken {
    refreshToken {
      ...RegularUser
    }
  }
`);

const DisableOtp = graphql(`
  mutation DisableOTP($otpCode: String!) {
    disableOTP(otpCode: $otpCode)
  }
`);

const UserQueryWithToken = graphql(`
  query UserQueryWithToken {
    user {
      ...RegularUser
      token
      otpEnabled
    }
  }
`);

export const Page: FC = () => {
  const [user] = useQuery({ query: UserQueryWithToken });
  const { logout } = useLogoutUser();
  const [, refreshMutation] = useMutation(RefreshToken);
  const [refresh, refreshing] = useAsync(async () => {
    // eslint-disable-next-line no-alert
    const confirmation = confirm('Are you sure? This will invalidate all existing configs and sessions and will sign you out of the dashboard.') // prettier-ignore
    if (!confirmation) return;
    await refreshMutation({});
    await logout();
  });

  useUserRedirect(user, true);

  const [disableOTPMut, disableOTP] = useMutation(DisableOtp);

  return (
    <Container>
      <Title>Preferences</Title>
      <Breadcrumbs href="/dashboard" className="mb-4">
        Dashboard
      </Breadcrumbs>
      <div className="grid grid-cols-2 gap-4">
        <div className="left col-span-full md:col-span-1">
          {user.data && (
            <Fragment>
              <div className="font-bold text-xl">Upload Token</div>
              <p className="text-sm mt-2 text-gray-400">
                This token is used when uploading files.{' '}
                <button
                  type="button"
                  className="text-purple-400 hover:underline"
                  onClick={refresh}
                  disabled={refreshing}
                >
                  Click here
                </button>{' '}
                to reset your token and invalidate all existing ShareX configurations.
              </p>
            </Fragment>
          )}
          {!user.data && (
            <Fragment>
              <Skeleton className="w-1/2 mb-1" />
              <Skeleton className="w-3/4" />
            </Fragment>
          )}
        </div>
        <div className="right flex items-center col-span-full md:col-span-1">
          {user.data && (
            <Input
              readOnly
              value={user.data.user.token}
              onFocus={(event) => {
                event.target.select();
              }}
            />
          )}
          {!user.data && <InputSkeleton />}
        </div>
      </div>
      <div className="mt-10">
        <ConfigGenerator user={user.data?.user} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="left col-span-full md:col-span-1">
          {user.data && (
            <Fragment>
              <div className="font-bold text-xl">2-factor Authentication</div>
              <p className="text-sm mt-2 text-gray-400">
                2-factor authentication is currently {user.data.user.otpEnabled ? 'enabled' : 'disabled'}.{' '}
                {user.data.user.otpEnabled ? `Enter an authenticator code to disable it.` : 'Click to setup.'}
              </p>
            </Fragment>
          )}
          {!user.data && (
            <Fragment>
              <Skeleton className="w-1/2 mb-1" />
              <Skeleton className="w-3/4" />
            </Fragment>
          )}
        </div>
        <div className="right flex items-center col-span-full md:col-span-1">
          {user.data && user.data.user.otpEnabled && (
            <OtpInput
              loading={disableOTPMut.fetching}
              onCode={(otpCode) => {
                disableOTP({ otpCode });
              }}
            />
          )}
          {user.data && !user.data.user.otpEnabled && (
            <Button className="w-auto ml-auto" onClick={() => navigate(`/dashboard/mfa`)}>
              Enable 2FA
            </Button>
          )}
          {!user.data && <ButtonSkeleton className="ml-auto" />}
        </div>
      </div>
    </Container>
  );
};
