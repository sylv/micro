import clsx from 'clsx';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import type { RegularUserFragment } from '../../@generated/graphql';
import { Container } from '../../components/container';
import { Section } from '../../components/section';
import { Skeleton, SkeletonList, SkeletonWrap } from '../../components/skeleton';
import { Toggle } from '../../components/toggle';
import { downloadFile } from '../../helpers/download.helper';
import { generateConfig } from '../../helpers/generate-config.helper';
import { useConfig } from '../../hooks/useConfig';
import { CustomisationOption } from './customisation-option';

export interface ConfigGeneratorProps {
  user?: RegularUserFragment & { token: string };
}

export const ConfigGenerator: FC<ConfigGeneratorProps> = ({ user }) => {
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [embedded, setEmbedded] = useState(true);
  const [pasteShortcut, setPasteShortcut] = useState(true);
  const config = useConfig();
  const downloadable = !!selectedHosts[0];

  const download = () => {
    if (!downloadable || !user) return;
    const { name, content } = generateConfig({
      direct: !embedded,
      hosts: selectedHosts,
      shortcut: pasteShortcut,
      token: user.token,
    });

    const cleanName = name.split('{{username}}').join(user.username);
    downloadFile(cleanName, content);
  };

  return (
    <Section>
      <Container className="flex flex-col justify-between dots selection:bg-purple-600 py-8 px-0">
        <div className="w-full flex-grow">
          <Fragment>
            <SkeletonWrap show={!config.data}>
              <div className="font-bold text-xl">Config Generator</div>
              <p className="text-sm text-gray-400">
                Pick the hosts you want with the options you think will suit you best. These options are saved in the
                config file and are not persisted between sessions. Changing them will not affect existing config files.
              </p>
            </SkeletonWrap>
            <div className="flex flex-col gap-2 mt-6">
              <SkeletonWrap show={!config.data}>
                <CustomisationOption
                  title="Direct Links"
                  description="Embedded links are recommended and will embed the image in the site with additional metadata and functionality like syntax highlighting. Direct links will return links that take you straight to the image, which may have better compatibility with some services."
                >
                  <Toggle
                    selected={embedded}
                    backgroundColour="bg-purple-600"
                    onChange={({ value }) => setEmbedded(value)}
                    options={[
                      {
                        label: 'Embedded',
                        value: true,
                      },
                      {
                        label: 'Direct',
                        value: false,
                      },
                    ]}
                  />
                </CustomisationOption>
              </SkeletonWrap>
              <SkeletonWrap show={!config.data}>
                <CustomisationOption
                  title="Paste Shortcut"
                  description="Whether to redirect text file uploads to the pastes endpoint"
                >
                  <Toggle
                    selected={pasteShortcut}
                    backgroundColour="bg-purple-600"
                    onChange={({ value }) => setPasteShortcut(value)}
                    options={[
                      {
                        label: 'Paste',
                        value: true,
                      },
                      {
                        label: 'Upload as File',
                        value: false,
                      },
                    ]}
                  />
                </CustomisationOption>
              </SkeletonWrap>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {config.data &&
                  config.data.hosts.map((host) => {
                    const isSelected = selectedHosts.includes(host.normalised);
                    const classes = clsx(
                      'rounded px-2 py-1 truncate transition border border-transparent',
                      isSelected && 'bg-purple-600 text-white',
                      !isSelected && 'text-gray-400 bg-dark-100 hover:bg-dark-200 hover:text-white',
                    );

                    return (
                      <button
                        type="button"
                        className={classes}
                        key={host.normalised}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedHosts(selectedHosts.filter((h) => h !== host.normalised));
                          } else {
                            setSelectedHosts([...selectedHosts, host.normalised]);
                          }
                        }}
                      >
                        {user ? host.normalised.replace('{{username}}', user.username) : host.normalised}
                      </button>
                    );
                  })}
                {!config.data && (
                  <SkeletonList count={6} as={Fragment}>
                    <Skeleton className="h-8" />
                  </SkeletonList>
                )}
              </div>
            </div>
          </Fragment>
        </div>
        <button
          type="submit"
          onClick={download}
          className={clsx(
            'mt-8 ml-auto flex items-center gap-1',
            downloadable ? 'text-purple-400 hover:underline' : 'text-gray-700 cursor-not-allowed',
          )}
        >
          <SkeletonWrap show={!config.data}>
            download config <FiDownload className="h-3.5 w-3.5" />
          </SkeletonWrap>
        </button>
      </Container>
    </Section>
  );
};
