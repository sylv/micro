import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../components/button';
import { Container } from '../../components/container';
import { Checkbox } from '../../components/input/checkbox';
import { Input } from '../../components/input/input';
import { Select } from '../../components/input/select';
import { TextArea } from '../../components/input/textarea';
import { Title } from '../../components/title';
import type { CreatePasteDto } from '../../generated/graphql';
import { useCreatePasteMutation } from '../../generated/graphql';
import { encryptContent } from '../../helpers/encrypt.helper';
import { useUser } from '../../hooks/useUser';
import ErrorPage from '../_error';

const EXPIRY_OPTIONS = [
  { name: '15 minutes', value: 15 },
  { name: '30 minutes', value: 30 },
  { name: '1 hour', value: 60 },
  { name: '2 hours', value: 120 },
  { name: '4 hours', value: 240 },
  { name: '8 hours', value: 480 },
  { name: '1 day', value: 1440 },
  { name: '2 days', value: 2880 },
  { name: '4 days', value: 4320 },
  { name: '1 week', value: 10080 },
  { name: '2 weeks', value: 20160 },
  { name: '1 month', value: 43200 },
  { name: '1 year', value: 525600 },
];

const TEXT_TYPES = [
  { name: 'Markdown', ext: 'md', type: 'text/markdown' },
  { name: 'Plain Text', ext: 'txt', type: 'text/plain' },
  { name: 'HTML', ext: 'html', type: 'text/html' },
  { name: 'JSON', ext: 'json', type: 'application/json' },
  { name: 'XML', ext: 'xml', type: 'application/xml' },
  { name: 'SQL', ext: 'sql', type: 'text/x-sql' },
  { name: 'JavaScript', ext: 'js', type: 'application/javascript' },
  { name: 'TypeScript', ext: 'ts', type: 'application/typescript' },
  { name: 'JSX', ext: 'jsx', type: 'text/jsx' },
  { name: 'TSX', ext: 'tsx', type: 'text/typescript-jsx' },
  { name: 'CSS', ext: 'css', type: 'text/css' },
  { name: 'SCSS', ext: 'scss', type: 'text/x-scss' },
  { name: 'SASS', ext: 'sass', type: 'text/x-sass' },
  { name: 'LESS', ext: 'less', type: 'text/x-less' },
  { name: 'GraphQL', ext: 'graphql', type: 'application/graphql' },
  { name: 'C', ext: 'c', type: 'text/x-c' },
  { name: 'C++', ext: 'cpp', type: 'text/x-c++' },
  { name: 'C#', ext: 'cs', type: 'text/x-csharp' },
  { name: 'Python', ext: 'py', type: 'text/x-python' },
  { name: 'R', ext: 'r', type: 'text/x-r' },
  { name: 'Ruby', ext: 'rb', type: 'text/x-ruby' },
  { name: 'Shell', ext: 'sh', type: 'text/x-shellscript' },
  { name: 'Java', ext: 'java', type: 'text/x-java' },
  { name: 'Kotlin', ext: 'kt', type: 'text/x-kotlin' },
  { name: 'Go', ext: 'go', type: 'text/x-go' },
  { name: 'Swift', ext: 'swift', type: 'text/x-swift' },
  { name: 'Rust', ext: 'rs', type: 'text/x-rust' },
  { name: 'YAML', ext: 'yaml', type: 'text/x-yaml' },
  { name: 'PHP', ext: 'php', type: 'text/x-php' },
  { name: 'Perl', ext: 'pl', type: 'text/x-perl' },
  { name: 'PowerShell', ext: 'ps1', type: 'text/x-powershell' },
  { name: 'Batch', ext: 'bat', type: 'text/x-batch' },
  { name: 'CoffeeScript', ext: 'coffee', type: 'text/x-coffeescript' },
  { name: 'Haskell', ext: 'hs', type: 'text/x-haskell' },
  { name: 'Julia', ext: 'jl', type: 'text/x-julia' },
  { name: 'Lua', ext: 'lua', type: 'text/x-lua' },
  { name: 'Matlab', ext: 'matlab', type: 'text/x-matlab' },
  { name: 'Pascal', ext: 'pas', type: 'text/x-pascal' },
];

const schema = Yup.object().shape({
  title: Yup.string().optional().max(100),
  content: Yup.string().required().min(1),
  encrypt: Yup.boolean().required(),
  extension: Yup.string().required(),
  burn: Yup.boolean().required(),
  paranoid: Yup.boolean().required(),
  hostname: Yup.string().optional(),
  expiryMinutes: Yup.number().required(),
});

export default function Paste() {
  const user = useUser();
  const [pasteMutation] = useCreatePasteMutation();
  if (user.error) {
    return <ErrorPage error={user.error} />;
  }

  return (
    <Container>
      <Title>New Paste</Title>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-4">New Paste</h1>
        <div className="flex items-center gap-2" />
      </div>
      <Formik
        validationSchema={schema}
        initialValues={{
          title: undefined,
          content: '',
          encrypt: false,
          extension: 'md',
          burn: false,
          paranoid: false,
          hostname: undefined,
          expiryMinutes: 1440,
        }}
        onSubmit={async (values) => {
          if (!user.data) return;
          const body: CreatePasteDto = {
            burn: values.burn,
            content: values.content,
            encrypted: false,
            paranoid: values.paranoid,
            extension: values.extension,
            hostname: values.hostname,
            title: values.title,
          };

          if (values.expiryMinutes) {
            const expiresInMs = Number(values.expiryMinutes) * 60 * 1000;
            body.expiresAt = Date.now() + expiresInMs;
          }

          let encryptionKey: string | undefined;
          if (values.encrypt) {
            const result = await encryptContent(values.content);
            body.encrypted = true;
            body.content = result.encryptedContent;
            encryptionKey = result.key;
          }

          const paste = await pasteMutation({
            variables: {
              input: body,
            },
          });

          if (paste.errors && paste.errors[0]) throw paste.errors[0];
          const url = new URL(paste.data!.createPaste.urls.view);
          if (body.burn) url.searchParams.set('burn_unless', user.data.id);
          if (encryptionKey) url.hash = `key=${encryptionKey}`;
          window.location.href = url.href;
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="space-y-2">
            <Input id="title" placeholder="Title" />
            <TextArea
              id="content"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder="Markdown, code or plain text"
            />
            <div className="flex gap-2 justify-end flex-wrap">
              <label className="flex gap-2 items-center">
                <Checkbox id="burn" />
                <span className="truncate">Destroy after viewing</span>
              </label>
              <label className="flex gap-2 items-center">
                <Checkbox id="paranoid" />
                Long ID
              </label>
              <label className="flex gap-2 items-center">
                <Checkbox id="encrypt" />
                Encrypt
              </label>
              <Select className="w-auto" id="expiryMinutes" type="number">
                <option value={0}>No Expiry</option>
                {EXPIRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </Select>
              <Select id="extension" className="w-auto" type="number">
                {TEXT_TYPES.map((option) => (
                  <option key={option.ext} value={option.ext}>
                    {option.name}
                  </option>
                ))}
              </Select>
              <Button type="submit" className="w-auto" disabled={!isValid || isSubmitting || !dirty}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
