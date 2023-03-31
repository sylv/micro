import { Migration } from '@mikro-orm/migrations';

export class Migration20230331131557 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" alter column "permissions" type int using ("permissions"::int);');
    this.addSql('alter table "users" alter column "permissions" set default 0;');

    this.addSql('alter table "links" alter column "clicks" type int using ("clicks"::int);');
    this.addSql('alter table "links" alter column "clicks" set default 0;');

    this.addSql('alter table "invites" add column "skip_verification" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" alter column "permissions" drop default;');
    this.addSql('alter table "users" alter column "permissions" type int using ("permissions"::int);');

    this.addSql('alter table "invites" drop column "skip_verification";');

    this.addSql('alter table "links" alter column "clicks" drop default;');
    this.addSql('alter table "links" alter column "clicks" type int using ("clicks"::int);');
  }

}
