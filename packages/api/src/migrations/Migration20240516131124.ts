import { Migration } from '@mikro-orm/migrations';

export class Migration20240516131124 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "files" rename column "is_external" to "external";');
    this.addSql('alter table "files" rename column "external_upload_error" to "external_error";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" rename column "external" to "is_external";');
    this.addSql('alter table "files" rename column "external_error" to "external_upload_error";');
  }

}
