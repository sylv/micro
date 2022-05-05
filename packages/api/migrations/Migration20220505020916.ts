import { Migration } from "@mikro-orm/migrations";

export class Migration20220505020916 extends Migration {
  async up(): Promise<void> {
    this.addSql('delete from "thumbnails";');
    this.addSql(
      'alter table "thumbnails" add column "type" varchar(255) not null, add column "width" int not null, add column "height" int not null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "thumbnails" drop column "type";');
    this.addSql('alter table "thumbnails" drop column "width";');
    this.addSql('alter table "thumbnails" drop column "height";');
  }
}
