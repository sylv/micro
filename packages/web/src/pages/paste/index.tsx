import type { CreatePasteBody, GetPasteData } from '@ryanke/micro-api';
import { useState } from 'react';
import { Button } from '../../components/button/button';
import { Container } from '../../components/container';
import { Select } from '../../components/input/select';
import { Title } from '../../components/title';
import { encryptContent } from '../../helpers/encrypt.helper';
import { http } from '../../helpers/http.helper';
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

const TYPE_OPTIONS = [
  { name: 'Markdown', ext: 'md' },
  { name: 'Plain Text', ext: 'txt' },
  { name: 'HTML', ext: 'html' },
  { name: 'JSON', ext: 'json' },
  { name: 'XML', ext: 'xml' },
  { name: 'SQL', ext: 'sql' },
  { name: 'JavaScript', ext: 'js' },
  { name: 'TypeScript', ext: 'ts' },
  { name: 'JSX', ext: 'jsx' },
  { name: 'TSX', ext: 'tsx' },
  { name: 'CSS', ext: 'css' },
  { name: 'SCSS', ext: 'scss' },
  { name: 'SASS', ext: 'sass' },
  { name: 'LESS', ext: 'less' },
  { name: 'GraphQL', ext: 'graphql' },
  { name: 'C', ext: 'c' },
  { name: 'C++', ext: 'cpp' },
  { name: 'C#', ext: 'cs' },
  { name: 'Python', ext: 'py' },
  { name: 'R', ext: 'r' },
  { name: 'Ruby', ext: 'rb' },
  { name: 'Shell', ext: 'sh' },
  { name: 'Java', ext: 'java' },
  { name: 'Kotlin', ext: 'kt' },
  { name: 'Go', ext: 'go' },
  { name: 'Swift', ext: 'swift' },
  { name: 'Rust', ext: 'rs' },
  { name: 'YAML', ext: 'yaml' },
  { name: 'PHP', ext: 'php' },
  { name: 'Perl', ext: 'pl' },
  { name: 'PowerShell', ext: 'ps1' },
  { name: 'Batch', ext: 'bat' },
];

export default function Paste() {
  const [expiryMinutes, setExpiryMinutes] = useState(1440);
  const [encrypt, setEncrypt] = useState(true);
  const [burn, setBurn] = useState(false);
  const [paranoid, setParanoid] = useState(false);
  const [content, setContent] = useState('');
  const [extension, setExtension] = useState<string | null>(null);
  const [pasting, setPasting] = useState(false);
  const [error, setError] = useState<any>(null);
  const [title, setTitle] = useState<string | undefined>();
  const inferredExtension = extension || (content.includes('# ') ? 'md' : 'txt');
  const submitDisabled = !content || pasting;

  const submit = async () => {
    try {
      setPasting(true);
      const body: CreatePasteBody = {
        content: content,
        burn: burn,
        encrypted: false,
        extension: inferredExtension,
        paranoid: paranoid,
        title: title,
      };

      if (expiryMinutes) {
        const expiresInMs = expiryMinutes * 60 * 1000;
        body.expiresAt = Date.now() + expiresInMs;
      }

      let encryptionKey: string | undefined;
      if (encrypt) {
        const result = await encryptContent(content);
        body.encrypted = true;
        body.content = result.encryptedContent;
        encryptionKey = result.key;
      }

      const response = await http(`paste`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const paste = (await response.json()) as GetPasteData;
      setPasting(false);
      let url = `/p/${paste.id}?burn=false`;
      if (encryptionKey) url += `#key=${encryptionKey}`;
      window.location.href = url;
    } catch (error) {
      setError(error);
    } finally {
      setPasting(false);
    }
  };

  if (error) {
    return <ErrorPage status={error.status} message={error.text || error.message} />;
  }

  return (
    <Container>
      <Title>New Paste</Title>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold mb-4">New Paste</h1>
        <div className="flex items-center gap-2" />
      </div>
      <input
        className="w-full bg-dark-400 outline-none focus:outline-purple-400 focus:outline-1 mb-4 px-2 py-1"
        placeholder="Title"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value || undefined);
        }}
      />
      <textarea
        className="w-full h-64 p-2 bg-dark-400 outline-none focus:outline-purple-400 focus:outline-1 rounded placeholder:text-gray-600"
        value={content}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        placeholder="Markdown, code or plain text"
        onChange={(event) => {
          setContent(event.target.value);
        }}
      />
      <div className="flex gap-2 justify-end">
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={burn}
            onChange={(event) => {
              setBurn(event.target.checked);
            }}
          />
          <span className="truncate">Destroy after viewing</span>
        </label>
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={paranoid}
            onChange={(event) => {
              setParanoid(event.target.checked);
            }}
          />
          Paranoid
        </label>
        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={encrypt}
            onChange={(event) => {
              setEncrypt(event.target.checked);
            }}
          />
          Encrypt
        </label>
        <Select
          value={expiryMinutes}
          className="w-auto"
          onChange={(event) => {
            setExpiryMinutes(Number(event.target.value));
          }}
        >
          <option value={0}>No Expiry</option>
          {EXPIRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </Select>
        <Select
          value={inferredExtension}
          className="w-auto"
          onChange={(event) => {
            setExtension(event.target.value);
          }}
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.ext} value={option.ext}>
              {option.name}
            </option>
          ))}
        </Select>
        <Button className="w-auto" disabled={submitDisabled} onClick={submit}>
          Submit
        </Button>
      </div>
    </Container>
  );
}
