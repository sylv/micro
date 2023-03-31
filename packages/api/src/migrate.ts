import type { Options } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { checkForOldDatabase, migrateOldDatabase } from './helpers/migrate-old-database.js';
import mikroOrmConfig, { MIGRATIONS_TABLE_NAME, ORM_LOGGER } from './orm.config.js';

const logger = new Logger('migrate');

export const migrate = async (
  config: Options = mikroOrmConfig,
  skipLock = process.env.SKIP_MIGRATION_LOCK === 'true'
) => {
  logger.debug(`Checking for and running migrations`);
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
    ORM_LOGGER.debug(`No pending migrations, ${executedMigrations.length} already executed`);
    return;
  }

  ORM_LOGGER.log(`Migrating through ${pendingMigrations.length} migrations`);
  await em.transactional(async (em) => {
    if (!skipLock) await em.execute(`LOCK TABLE ${MIGRATIONS_TABLE_NAME} IN EXCLUSIVE MODE`);
    await migrator.up({ transaction: em.getTransactionContext() });
  });

  await orm.close();
  logger.debug(`Migrations check complete`);
};
