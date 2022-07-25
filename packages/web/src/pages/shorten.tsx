import { Button, Container } from '@ryanke/pandora';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { Input } from '../components/input/input';
import { Select } from '../components/input/select';
import { useShortenMutation } from '../generated/graphql';
import { useConfig } from '../hooks/useConfig';
import { useUser } from '../hooks/useUser';

const schema = Yup.object().shape({
  host: Yup.string().optional(),
  url: Yup.string()
    .matches(/^(http|https):\/\/[^ "]+$/u, 'Not a well-formed URL')
    .required(),
});

export default function Shorten() {
  const [shortenMutation] = useShortenMutation();
  const [result, setResult] = useState<string | null>(null);
  const config = useConfig();

  useUser(true);

  return (
    <Container centerX centerY>
      <h1 className="leading-10 font-bold text-2xl">Shorten URL</h1>
      {!result && <p className="text-sm text-gray-500 mb-2">Enter a link below and get a short URL</p>}
      {result && <p className="text-sm text-gray-500 mb-2">Your shortened link is below.</p>}
      {!result && (
        <Formik
          initialValues={{ host: undefined, url: '' }}
          validationSchema={schema}
          onSubmit={async (values) => {
            const result = await shortenMutation({
              variables: {
                link: values.url,
                host: values.host,
              },
            });

            setResult(result.data!.createLink.urls.view);
          }}
        >
          {({ dirty, isSubmitting, isValid }) => (
            <Form className="space-y-2">
              <div>
                <Select id="host">
                  {config.data?.hosts.map((host) => (
                    <option key={host.normalised} value={host.normalised}>
                      {host.normalised}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Input id="url" placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
              </div>
              <Button disabled={!isValid || isSubmitting || !dirty} loading={isSubmitting}>
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      )}
      {result && (
        <div>
          <Input
            readOnly
            value={result}
            onFocus={(event) => {
              event.target.select();
            }}
          />
        </div>
      )}
    </Container>
  );
}
