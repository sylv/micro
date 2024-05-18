import { Migration } from '@mikro-orm/migrations';

export class Migration20240517030754 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "files" alter column "external_error" type text using ("external_error"::text);');
    this.addSql('alter table "files" alter column "thumbnail_error" type text using ("thumbnail_error"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" alter column "external_error" type varchar(255) using ("external_error"::varchar(255));');
    this.addSql('alter table "files" alter column "thumbnail_error" type varchar(255) using ("thumbnail_error"::varchar(255));');
  }

}
