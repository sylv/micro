import { Migration } from '@mikro-orm/migrations';

export class Migration20220620200410 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "pastes" add column "title" varchar(128) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pastes" drop column "title";');
  }
}
