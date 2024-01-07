import { readdirSync } from 'fs';
import { join } from 'path';

const external = [
  '@nestjs/microservices',
  '@nestjs/platform-express',
  '@nestjs/websockets',
  '@fastify/view',
  'ts-morph',
  '@mikro-orm/seeder',
  '@apollo/subgraph',
  '@mikro-orm/entity-generator',
  '@mikro-orm/mongodb',
  '@mikro-orm/mysql',
  '@mikro-orm/mariadb',
  '@mikro-orm/sqlite',
  '@mikro-orm/better-sqlite',
  'sqlite3',
  'mysql',
  'class-transformer/storage',
  'better-sqlite3',
  'mysql2',
  'pg-query-stream',
  'oracledb',
  'tedious',
];

const migrationsDir = join(import.meta.dir, 'migrations');
const migrationNames = readdirSync(migrationsDir).map((file) => join('./src/migrations', file));

const result = await Bun.build({
  entrypoints: ['./src/main.ts', ...migrationNames],
  root: import.meta.dir,
  target: 'node',
  external: external,
  outdir: './dist',
  splitting: true,
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.FLUENTFFMPEG_COV': 'false',
  },
});

for (const log of result.logs) console.log(log);
