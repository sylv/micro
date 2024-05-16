import { Migration } from '@mikro-orm/migrations';

export class Migration20240516130826 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "files" add column "external_upload_error" varchar(255) null, add column "thumbnail_error" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" drop column "external_upload_error", drop column "thumbnail_error";');
  }

}
