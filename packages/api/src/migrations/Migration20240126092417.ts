import { Migration } from '@mikro-orm/migrations';

export class Migration20240126092417 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "files" add column "is_utf8" boolean null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" drop column "is_utf8";');
  }
}
