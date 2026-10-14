import { MikroORM, type Options } from "@mikro-orm/postgresql";
import type { Migrator } from "@mikro-orm/migrations";
import { Logger } from "@nestjs/common";
import mikroOrmConfig, { MIGRATIONS_TABLE_NAME, ORM_LOGGER } from "./orm.config.js";

const logger = new Logger("migrate");

export const migrate = async (
  config: Options = mikroOrmConfig,
  skipLock = process.env.SKIP_MIGRATION_LOCK === "true",
) => {
  logger.debug(`Checking for and running migrations`);

  const orm = await MikroORM.init(config);
  const em = orm.em.fork({ clear: true });

  const migrator = orm.migrator as Migrator;
  const executedMigrations = await migrator.getExecuted();
  const pendingMigrations = await migrator.getPending();
  if (!pendingMigrations[0]) {
    ORM_LOGGER.debug(`No pending migrations, ${executedMigrations.length} already executed`);
    await orm.close();
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
