import { Container } from '../../components/container';
import { PageLoader } from '../../components/page-loader';

import type { GetUploadTokenData, PutUploadTokenData } from '@ryanke/micro-api';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Breadcrumbs } from '../../components/breadcrumbs';
import { ConfigGenerator } from '../../components/config-generator/config-generator';
import { Title } from '../../components/title';
import { getErrorMessage } from '../../helpers/get-error-message.helper';
import { http } from '../../helpers/http.helper';
import { useConfig } from '../../hooks/use-config.hook';
import { useToasts } from '../../hooks/use-toasts.helper';
import { useUser } from '../../hooks/use-user.helper';

export default function Preferences() {
  const token = useSWR<GetUploadTokenData>(`user/token`);
  const [regenerating, setRegenerating] = useState(false);
  const user = useUser();
  const setToast = useToasts();
  const config = useConfig();

  useEffect(() => {
    if (token.error) Router.replace('/');
    if (user.error) {
      // todo: for some reason making this /login results in
      // infinite loops of redirects between /login and /dashboard
      // but only sometimes. that shouldn't happen.
      Router.replace('/');
    }
  }, [user, config, token]);

  if (!user.data || !config.data || !token.data) {
    return <PageLoader title="Preferences" />;
  }

  /**
   * Regenerate the users token and mutate the global user object.
   */
  const regenerateToken = async () => {
    if (regenerating) return;
    // eslint-disable-next-line no-alert
    const confirmation = confirm('Are you sure? This will invalidate all existing configs and sessions and will sign you out of the dashboard.') // prettier-ignore
    if (!confirmation) return;
    setRegenerating(true);

    try {
      const response = await http(`user/token`, { method: 'PUT' });
      const body = (await response.json()) as PutUploadTokenData;
      mutate(`user`, null);
      mutate(`user/token`, body, false);
      setRegenerating(false);
      setToast({ text: 'Your token has been regenerated.' });
    } catch (error: unknown) {
      const message = getErrorMessage(error) ?? 'An unknown error occured.';
      setRegenerating(false);
      setToast({ error: true, text: message });
    }
  };

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
            <button
              type="button"
              className="text-purple-400 hover:underline"
              onClick={regenerateToken}
              disabled={regenerating}
            >
              Click here
            </button>{' '}
            to reset your token and invalidate all existing ShareX configurations.
          </p>
        </div>
        <div className="right flex items-center col-span-full md:col-span-1">
          <input
            className="bg-black rounded text-white px-2 py-1 outline-none border border-transparent focus:border-purple-400 w-full"
            readOnly
            value={token.data.token}
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
