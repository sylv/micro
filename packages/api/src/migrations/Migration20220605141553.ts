import { Migration } from '@mikro-orm/migrations';

export class Migration20220605141553 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "links" alter column "destination" type varchar(1024) using ("destination"::varchar(1024));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "links" alter column "destination" type varchar(255) using ("destination"::varchar(255));');
  }

}
