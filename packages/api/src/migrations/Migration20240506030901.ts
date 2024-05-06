import { Migration } from '@mikro-orm/migrations';

export class Migration20240506030901 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "disabled_reason" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "disabled_reason";');
  }

}
