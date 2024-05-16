import { Migration } from '@mikro-orm/migrations';

export class Migration20240516131911 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "files" drop constraint "files_thumbnail_file_id_foreign";');

    this.addSql('alter table "files" drop constraint "files_thumbnail_file_id_unique";');
    this.addSql('alter table "files" drop column "thumbnail_file_id";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "files" add column "thumbnail_file_id" varchar(255) null;');
    this.addSql('alter table "files" add constraint "files_thumbnail_file_id_foreign" foreign key ("thumbnail_file_id") references "thumbnails" ("file_id") on update cascade on delete set null;');
    this.addSql('alter table "files" add constraint "files_thumbnail_file_id_unique" unique ("thumbnail_file_id");');
  }

}
