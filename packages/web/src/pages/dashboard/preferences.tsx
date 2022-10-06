import { Breadcrumbs, Button, Container, useAsync } from '@ryanke/pandora';
import { useRouter } from 'next/router';
import { OtpInput } from 'src/components/input/otp';
import { Input } from '../../components/input/input';
import { PageLoader } from '../../components/page-loader';
import { Title } from '../../components/title';
import { ConfigGenerator } from '../../containers/config-generator/config-generator';
import { GetUserDocument, useDisableOtpMutation, useRefreshTokenMutation } from '../../generated/graphql';
import { useConfig } from '../../hooks/useConfig';
import { useUser } from '../../hooks/useUser';

export default function Preferences() {
  const user = useUser(true);
  const config = useConfig();
  const router = useRouter();
  const [refreshMutation] = useRefreshTokenMutation();
  const [refresh, refreshing] = useAsync(async () => {
    // eslint-disable-next-line no-alert
    const confirmation = confirm('Are you sure? This will invalidate all existing configs and sessions and will sign you out of the dashboard.') // prettier-ignore
    if (!confirmation) return;
    await refreshMutation();
    await user.logout();
  });

  const [disableOTP, disableOTPMut] = useDisableOtpMutation({
    refetchQueries: [{ query: GetUserDocument }],
  });

  if (!user.data || !config.data) {
    return <PageLoader title="Preferences" />;
  }

  return (
    <Container>
      <Title>Preferences</Title>
      <Breadcrumbs href="/dashboard" className="mb-4">
        Dashboard
      </Breadcrumbs>
      <div className="grid grid-cols-2 gap-4">
        <div className="left col-span-full md:col-span-1">
          <div className="font-bold text-xl">Upload Token</div>
          <p className="text-sm mt-2 text-gray-400">
            This token is used when uploading files.{' '}
            <button type="button" className="text-purple-400 hover:underline" onClick={refresh} disabled={refreshing}>
              Click here
            </button>{' '}
            to reset your token and invalidate all existing ShareX configurations.
          </p>
        </div>
        <div className="right flex items-center col-span-full md:col-span-1">
          <Input
            readOnly
            value={user.data.token}
            onFocus={(event) => {
              event.target.select();
            }}
          />
        </div>
      </div>
      <div className="mt-10">
        <ConfigGenerator />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="left col-span-full md:col-span-1">
          <div className="font-bold text-xl">2-factor Authentication</div>
          <p className="text-sm mt-2 text-gray-400">
            2-factor authentication is currently {user.data.otpEnabled ? 'enabled' : 'disabled'}.{' '}
            {user.data.otpEnabled ? `Enter an authenticator code to disable it.` : 'Click to setup.'}
          </p>
        </div>
        <div className="right flex items-center col-span-full md:col-span-1">
          {user.data.otpEnabled && (
            <OtpInput
              loading={disableOTPMut.loading}
              onCode={(otpCode) => {
                disableOTP({
                  variables: { otpCode },
                });
              }}
            />
          )}
          {!user.data.otpEnabled && (
            <Button className="w-auto ml-auto" onClick={() => router.push(`/dashboard/mfa`)}>
              Enable 2FA
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
