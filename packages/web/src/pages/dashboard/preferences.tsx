import { Container } from '../../components/container';
import { PageLoader } from '../../components/page-loader';

import { Breadcrumbs } from '../../components/breadcrumbs';
import { Title } from '../../components/title';
import { ConfigGenerator } from '../../containers/config-generator/config-generator';
import { useRefreshTokenMutation } from '../../generated/graphql';
import { useAsync } from '../../hooks/useAsync';
import { useConfig } from '../../hooks/useConfig';
import { useUser } from '../../hooks/useUser';

export default function Preferences() {
  const user = useUser(true);
  const config = useConfig();
  const [refreshMutation] = useRefreshTokenMutation();
  const [refresh, refreshing] = useAsync(async () => {
    // eslint-disable-next-line no-alert
    const confirmation = confirm('Are you sure? This will invalidate all existing configs and sessions and will sign you out of the dashboard.') // prettier-ignore
    if (!confirmation) return;
    await refreshMutation();
    await user.logout();
  });

  if (!user.data || !config.data) {
    return <PageLoader title="Preferences" />;
  }

  return (
    <Container>
      <Title>Preferences</Title>
      <Breadcrumbs to="/dashboard" className="mb-4">
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
          <input
            className="bg-black rounded text-white px-2 py-1 outline-none border border-transparent focus:border-purple-400 w-full"
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
      {/* <div className="grid grid-cols-8 gap-2">
          <div className="col-span-full md:col-span-2">
            <Button disabled={regenerating} onClick={regenerateToken}>
              Regenerate
            </Button>
          </div>
          <div className="col-span-full md:col-span-6">
            <HostList
              prefix="ShareX config hosts"
              hosts={config.data.hosts.map((host) => host.normalised)}
              username={user.data.username}
              onChange={(hosts) => {
                setSelectedHosts(hosts);
              }}
            />
          </div>
          <div className="col-span-full md:col-span-2">
            <ShareXButton hosts={selectedHosts} token={token.data.token} />
          </div>
        </div> */}
    </Container>
  );
}
