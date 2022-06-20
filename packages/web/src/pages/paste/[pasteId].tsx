import { GetPasteData } from '@ryanke/micro-api';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BookOpen, Clock, Trash } from 'react-feather';
import useSWR from 'swr';
import { Container } from '../../components/container';
import { Embed } from '../../components/embed/embed';
import { PageLoader } from '../../components/page-loader';
import { Time } from '../../components/time';
import { decryptContent } from '../../helpers/encrypt.helper';
import { fetcher } from '../../helpers/fetcher.helper';
import { hashToObject } from '../../helpers/hash-to-object';
import { http, HTTPError } from '../../helpers/http.helper';
import { Warning } from '../../warning';
import ErrorPage from '../_error';

export interface ViewPasteProps {
  fallbackData?: GetPasteData;
}

export default function ViewPaste({ fallbackData }: ViewPasteProps) {
  const router = useRouter();
  const [burn] = useState(() => router.query.burn !== 'false');
  const [burnt, setBurnt] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [missingKey, setMissingKey] = useState(false);
  const pasteId = router.query.pasteId as string | undefined;
  const paste = useSWR<GetPasteData>(pasteId ? `paste/${pasteId}?burn=${burn}` : null, {
    fallbackData: fallbackData,
    revalidateOnMount: !fallbackData,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    // handle decrypting encrypted pastes
    if (!paste.data?.content) {
      if (content) setContent('');
      return;
    }

    if (!paste.data.encrypted) {
      setContent(paste.data.content);
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
      encryptedContent: paste.data.content,
    })
      .then((content) => {
        setContent(content);
      })
      .catch((error) => {
        setContent('');
        setError(error);
      });
  }, [paste.data?.content, router]);

  useEffect(() => {
    // burn the paste when its viewed
    // this is done client-side in js as a best-effort thing because doing it server-side would mean
    // scrapers (like when you paste it into discord) would burn the paste when discord checks for opengraph/an image/etc.
    if (!burn || !paste.data?.burn) return;
    http(`paste/${pasteId}/burn`, {
      method: 'POST',
    }).then((res) => {
      if (res.ok) {
        setBurnt(true);
      }
    });
  }, [paste.data]);

  useEffect(() => {
    // remove the burn query param
    const url = new URL(window.location.href);
    if (url.searchParams.has('burn')) {
      url.searchParams.delete('burn');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  if (paste.error || error) {
    const showError = paste.error ?? error;
    return <ErrorPage status={showError.status} message={showError.text || showError.message} />;
  }

  if (missingKey) {
    return (
      <ErrorPage
        status={401}
        message="This paste is encrypted and requires the encryption key to be provided in the URL."
      />
    );
  }

  if (!paste.data) {
    return <PageLoader />;
  }

  return (
    <Container className="mb-10 mt-10">
      {paste.data.burn && !burn && !burnt && (
        <Warning className="mb-4">
          This paste will be burnt by the next person to view this page and will be unviewable.
        </Warning>
      )}

      {burnt && (
        <Warning className="mb-4">
          This paste has been burnt and will be gone once you close or reload this page.
        </Warning>
      )}
      {paste.data.title && (
        <h1 className="mr-2 text-xl font-bold truncate md:text-4xl md:break-all mb-4">{paste.data.title}</h1>
      )}
      <div className="grid">
        <Embed
          data={{
            type: paste.data.type,
            size: paste.data.content.length,
            displayName: `paste.${paste.data.extension}`,
            content: { data: content, error: error },
            paths: {
              view: `/paste/${pasteId}`,
              direct: `/paste/${pasteId}.txt`,
            },
          }}
        />
      </div>
      <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> {content?.length ?? 0} characters
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4" />{' '}
          <span>
            Created <Time date={paste.data.createdAt} />
          </span>
        </span>
        {paste.data.expiresAt && !burnt && (
          <span className="flex items-center gap-2">
            <Trash className="h-4 w-4" />{' '}
            <span>
              Expires <Time date={paste.data.expiresAt} />
            </span>
          </span>
        )}
      </p>
    </Container>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ViewPasteProps>> {
  try {
    const fallbackData = await fetcher<GetPasteData>(`paste/${context.query.pasteId}`, context);
    return { props: { fallbackData } };
  } catch (error) {
    if (error instanceof HTTPError) {
      return { notFound: true };
    }

    throw error;
  }
}
