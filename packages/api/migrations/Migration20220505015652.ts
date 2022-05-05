import { Migration } from '@mikro-orm/migrations';

export class Migration20220505015652 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "files" add column "metadata_height" int null, add column "metadata_width" int null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" drop column "metadata_height";');
    this.addSql('alter table "files" drop column "metadata_width";');
  }

}
