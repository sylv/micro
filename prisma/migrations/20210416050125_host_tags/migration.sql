-- "host" was added for restricting uploads to
-- specific hosts
ALTER TABLE "files" ADD COLUMN     "host" TEXT;
ALTER TABLE "links" ADD COLUMN     "host" TEXT;

-- "tags" was added
-- "token" was renamed to "secret"
ALTER TABLE "users" ADD COLUMN     "tags" TEXT[];
ALTER TABLE "users" RENAME COLUMN "token" TO "secret";