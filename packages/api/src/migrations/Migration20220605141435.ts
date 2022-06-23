import { Migration } from '@mikro-orm/migrations';

export class Migration20220605141435 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "files" alter column "delete_key" type varchar(255) using ("delete_key"::varchar(255));');
    this.addSql('alter table "files" alter column "delete_key" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" alter column "delete_key" type varchar(255) using ("delete_key"::varchar(255));');
    this.addSql('alter table "files" alter column "delete_key" set not null;');
  }
}
