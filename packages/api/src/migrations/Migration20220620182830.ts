import { Migration } from '@mikro-orm/migrations';

export class Migration20220620182830 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "pastes" add column "hostname" varchar(255) null;');
    this.addSql('alter table "links" rename column "host" to "hostname";');
    this.addSql('alter table "files" rename column "host" to "hostname";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pastes" drop column "hostname";');
    this.addSql('alter table "links" rename column "hostname" to "host";');
    this.addSql('alter table "files" rename column "hostname" to "host";');
  }
}
