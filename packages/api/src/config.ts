import { loadConfig } from '@ryanke/venera';
import c from 'chalk';
import { randomBytes } from 'crypto';
import dedent from 'dedent';
import escapeStringRegexp from 'escape-string-regexp';
import ms from 'ms';
import z, { any, array, boolean, number, record, strictObject, string, union } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { expandMime } from './helpers/expand-mime.js';
import { HostService } from './modules/host/host.service.js';
import { parseBytes } from './helpers/parse-bytes.js';

export type MicroHost = ReturnType<typeof enhanceHost>;

const schema = strictObject({
  databaseUrl: string().startsWith('postgresql://'),
  secret: string().min(6),
  inquiries: string().email(),
  uploadLimit: string().transform(parseBytes),
  maxPasteLength: number().default(500000),
  allowTypes: z
    .union([array(string()), string()])
    .optional()
    .transform((value) => (value ? new Set(expandMime(value)) : null)),
  storagePath: string(),
  restrictFilesToHost: boolean().default(true),
  purge: strictObject({
    overLimit: string().transform(parseBytes),
    afterTime: string().transform(ms),
  }).optional(),
  email: strictObject({
    from: string().email(),
    smtp: record(string(), any()),
  }).optional(),
  conversions: array(
    strictObject({
      from: union([array(string()), string()]).transform((value) => new Set(expandMime(value))),
      to: string(),
      minSize: string().transform(parseBytes).optional(),
    }),
  ).optional(),
  hosts: array(
    strictObject({
      url: z
        .string()
        .url()
        .transform((value) => value.replace(/\/$/, '')),
      tags: array(string()).optional(),
      redirect: string().url().optional(),
    }),
  ),
});

const data = loadConfig('micro');
const result = schema.safeParse(data);
if (!result.success) {
  console.dir({ data, error: result.error }, { depth: null });
  const pretty = fromZodError(result.error);
  throw new Error(pretty.toString());
}

const getWildcardPattern = (url: string) => {
  const normalised = HostService.normaliseHostUrl(url);
  const escaped = escapeStringRegexp(normalised);
  const pattern = escaped.replace('\\{\\{username\\}\\}', '(?<username>[a-z0-9-{}]+?)');
  return new RegExp(`^(https?:\\/\\/)?${pattern}\\/?`, 'u');
};

const enhanceHost = (host: z.infer<typeof schema>['hosts'][0]) => {
  const isWildcard = host.url.includes('{{username}}');
  const normalised = HostService.normaliseHostUrl(host.url);
  const pattern = getWildcardPattern(host.url);

  return {
    ...host,
    isWildcard,
    normalised,
    pattern,
  };
};

export const config = result.data as Omit<z.infer<typeof schema>, 'hosts'>;
export const hosts = result.data.hosts.map((host) => enhanceHost(host));
export const rootHost = hosts[0];

if (rootHost.isWildcard) {
  throw new Error(`Root host cannot be a wildcard domain.`);
}

const disallowed = new Set(['youshallnotpass', 'you_shall_not_pass', 'secret', 'test']);
if (disallowed.has(config.secret.toLowerCase())) {
  const token = randomBytes(24).toString('hex');
  throw new Error(
    dedent`
      ${c.redBright.bold('Do not use the default secret.')}
      Please generate a random, secure secret or you risk anyone being able to impersonate you.
      If you're lazy, here is a random secret: ${c.underline(token)}
    `,
  );
}
