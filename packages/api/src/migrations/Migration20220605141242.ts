import { Migration } from '@mikro-orm/migrations';

export class Migration20220605141242 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" drop constraint "users_invite_id_foreign";');

    this.addSql('alter table "users" alter column "invite_id" type varchar(255) using ("invite_id"::varchar(255));');
    this.addSql('alter table "users" alter column "invite_id" drop not null;');
    this.addSql('alter table "users" add constraint "users_invite_id_foreign" foreign key ("invite_id") references "invites" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop constraint "users_invite_id_foreign";');

    this.addSql('alter table "users" alter column "invite_id" type varchar(255) using ("invite_id"::varchar(255));');
    this.addSql('alter table "users" alter column "invite_id" set not null;');
    this.addSql('alter table "users" add constraint "users_invite_id_foreign" foreign key ("invite_id") references "invites" ("id") on update cascade;');
  }

}
