import type { Options } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/postgresql';
import { checkForOldDatabase, migrateOldDatabase } from './helpers/migrate-old-database';
import mikroOrmConfig, { migrationsTableName, ormLogger } from './orm';

export const migrate = async (
  config: Options = mikroOrmConfig,
  skipLock = process.env.SKIP_MIGRATION_LOCK === 'true'
) => {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork({ clear: true }) as EntityManager;
  const connection = em.getConnection();
  const migrator = orm.getMigrator();
  const oldDatabaseExists = await checkForOldDatabase(connection);
  if (oldDatabaseExists) {
    await migrateOldDatabase(em, migrator);
    return;
  }

  const executedMigrations = await migrator.getExecutedMigrations();
  const pendingMigrations = await migrator.getPendingMigrations();
  if (!pendingMigrations[0]) {
    ormLogger.debug(`No pending migrations, ${executedMigrations.length} already executed`);
    return;
  }

  ormLogger.log(`Migrating through ${pendingMigrations.length} migrations`);
  await em.transactional(async (em) => {
    if (!skipLock) await em.execute(`LOCK TABLE ${migrationsTableName} IN EXCLUSIVE MODE`);
    await migrator.up({ transaction: em.getTransactionContext() });
  });

  await orm.close();
};
