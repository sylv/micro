import { useQuery } from '@apollo/client';
import { FC, useEffect, useState } from 'react';
import { FiBookOpen, FiClock, FiTrash } from 'react-icons/fi';
import { graphql } from '../../../@generated';
import { Button } from '../../../components/button';
import { Container } from '../../../components/container';
import { Embed } from '../../../components/embed/embed';
import { Error, Lenny } from '../../../components/error';
import { PageLoader } from '../../../components/page-loader';
import { Time } from '../../../components/time';
import { Warning } from '../../../components/warning';
import { decryptContent } from '../../../helpers/encrypt.helper';
import { hashToObject } from '../../../helpers/hash-to-object';
import { navigate } from '../../../helpers/routing';
import { useUser } from '../../../hooks/useUser';
import { PageProps } from '../../../renderer/types';

const PasteQuery = graphql(`
  query GetPaste($pasteId: ID!) {
    paste(pasteId: $pasteId) {
      id
      title
      type
      extension
      content
      encrypted
      createdAt
      expiresAt
      burnt
      burn
      urls {
        view
      }
    }
  }
`);

export const Page: FC<PageProps> = ({ routeParams }) => {
  const user = useUser();
  const [burnUnless, setBurnUnless] = useState<string | null | undefined>();
  const [confirmedBurn, setConfirmedBurn] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [missingKey, setMissingKey] = useState(false);
  const pasteId = routeParams.pasteId;

  const skipQuery =
    !pasteId || (!confirmedBurn && (burnUnless === undefined || (burnUnless ? burnUnless !== user.data?.id : false)));

  const paste = useQuery(PasteQuery, {
    skip: skipQuery,
    variables: {
      pasteId: pasteId!,
    },
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const burnUnless = url.searchParams.get('burn_unless');
    if (!burnUnless) {
      setBurnUnless(null);
      return;
    }

    setBurnUnless(burnUnless);
    url.searchParams.delete('burn_unless');
    navigate(url.href, { overwriteLastHistoryEntry: true });
  }, []);

  useEffect(() => {
    // handle decrypting encrypted pastes
    if (!paste.data?.paste.content) {
      if (content) setContent('');
      return;
    }

    if (!paste.data.paste.encrypted) {
      setContent(paste.data.paste.content);
      return;
    }

    const hash = hashToObject(window.location.hash);
    const key = hash.key;
    if (!key) {
      setMissingKey(true);
      return;
    }

    decryptContent({
      key: key,
      encryptedContent: paste.data.paste.content,
    })
      .then((content) => {
        setContent(content);
      })
      .catch((error) => {
        setContent('');
        setError(error);
      });
  }, [content, paste.data]);

  if (paste.error || error) {
    return <Error error={paste.error ?? error} />;
  }

  if (!confirmedBurn && burnUnless && (!user.data || burnUnless !== user.data.id)) {
    return (
      <Container centerY centerX>
        <h1 className="text-xl font-bold">Viewing this paste will destroy it</h1>
        <p className="max-w-xl text-center text-gray-400">
          This paste is set to be destroyed unless anyone but the owner views it.
        </p>
        <Button className="max-w-xs mt-4" onClick={() => setConfirmedBurn(true)}>
          Destroy Paste and View
        </Button>
      </Container>
    );
  }

  if (missingKey) {
    return (
      <Error
        lenny={Lenny.Crying}
        message="This paste is encrypted and requires the encryption key to be provided in the URL."
      />
    );
  }

  if (!paste.data) {
    return <PageLoader />;
  }

  return (
    <Container className="mb-10">
      {!paste.data.paste.burnt && paste.data.paste.burn && (
        <Warning className="mb-4">This paste will be burnt as soon as someone else views it.</Warning>
      )}

      {paste.data.paste.burnt && (
        <Warning className="mb-4">
          This paste has been burnt and will be gone once you close or reload this page.
        </Warning>
      )}
      {paste.data.paste.title && (
        <h1 className="mr-2 text-xl font-bold truncate md:text-4xl md:break-all mb-4">{paste.data.paste.title}</h1>
      )}
      <Embed
        data={{
          type: 'text/plain',
          size: paste.data.paste.content.length,
          displayName: paste.data.paste.title ?? `${paste.data.paste.id}.${paste.data.paste.extension}`,
          textContent: paste.data.paste.content,
          paths: {
            view: `/paste/${pasteId}`,
            direct: `/paste/${pasteId}.txt`,
          },
        }}
      />
      <p className="text-gray-600 text-sm mt-2 flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-2">
          <FiBookOpen className="h-4 w-4" /> {content?.length ?? 0} characters
        </span>
        <span className="flex items-center gap-2">
          <FiClock className="h-4 w-4" />{' '}
          <span>
            Created <Time date={paste.data.paste.createdAt} />
          </span>
        </span>
        {paste.data.paste.expiresAt && !confirmedBurn && (
          <span className="flex items-center gap-2">
            <FiTrash className="h-4 w-4" />{' '}
            <span>
              Expires <Time date={paste.data.paste.expiresAt} />
            </span>
          </span>
        )}
      </p>
    </Container>
  );
};
