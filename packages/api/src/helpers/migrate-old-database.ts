import type { Connection, IMigrator } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import dedent from 'dedent';

const logger = new Logger('micro');
const migrationErrorWarning = dedent`
  An old database for a previous version of micro was found. 
  To use this database with the new version, it must be migrated to the new format.
  This can be done automatically, but first you need to create a database backup and ensure it works.

  I am not kidding, do a backup now and make sure it works. If you skip this step and things go wrong, its on you.
  Once you have a backup and you are sure that backup works, you can continue on the migration path.

  To get started, start micro with the "MIGRATE_OLD_DATABASE" environment variable set to "true".
  On startup the database will be migrated to the new format automatically, then startup will continue as normal.

  If anything goes wrong during the migration, create a new issue on GitHub https://github.com/sylv/micro/issues/new immediately.
`;

const legacyMigrationWarning = dedent`
  You have set "MIGRATE_OLD_DATABASE" to "true", so the old database will be migrated to the new format.
  This may take some time, please be patient.
`;

export async function checkForOldDatabase(connection: Connection) {
  logger.debug(`Checking for old database`);
  const result = await connection.execute(
    `SELECT EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_prisma_migrations')`
  );

  return result[0].exists;
}

// https://tenor.com/vGfQ.gif
export async function migrateOldDatabase(em: EntityManager, migrator: IMigrator) {
  logger.debug(`Migrating old database`);
  if (process.env.MIGRATE_OLD_DATABASE !== 'true') {
    logger.error(migrationErrorWarning);
    process.exit(1);
  }

  logger.warn(legacyMigrationWarning);
  await em.transactional(async (em) => {
    const trx = em.getTransactionContext();
    const execute = (sql: string) =>
      em
        .createQueryBuilder('files')
        .raw(sql)
        .transacting(trx)
        .then((result) => result);

    await execute(`CREATE SCHEMA public_old`);
    const tables = ['files', 'users', 'links', 'thumbnails', '_prisma_migrations'];
    for (const table of tables) {
      await execute(`ALTER TABLE "public"."${table}" SET SCHEMA "public_old"`);
    }

    await migrator.up({ transaction: trx });
    await execute(`UPDATE public_old.users SET tags = array[]::text[] WHERE tags IS NULL`);
    await execute(dedent`
      INSERT INTO public.users (id, username, permissions, password, secret, tags)
      SELECT id, username, permissions, password, secret, tags FROM public_old.users
    `);

    await execute(dedent`
      INSERT INTO public.files (id, host, type, size, hash, name, owner_id, created_at)
      SELECT id, host, type, size, hash, name, "ownerId", "createdAt" FROM public_old.files
    `);

    await execute(dedent`
      INSERT INTO public.links (id, destination, host, clicks, created_at, owner_id)
      SELECT id, destination, host, clicks, "createdAt", "ownerId" FROM public_old.links
    `);
  });
}
