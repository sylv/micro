import { Migration } from '@mikro-orm/migrations';

export class Migration20220629034805 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users_verification" ("id" varchar(255) not null, "user_id" varchar(255) not null, "expires_at" timestamptz(0) not null);');
    this.addSql('alter table "users_verification" add constraint "users_verification_pkey" primary key ("id");');

    this.addSql('alter table "users_verification" add constraint "users_verification_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete CASCADE;');

    this.addSql('alter table "users" add column "email" varchar(255) null, add column "verified_email" boolean not null default false;');
    this.addSql('create index "users_email_index" on "users" ("email");');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users_verification" cascade;');

    this.addSql('drop index "users_email_index";');
    this.addSql('alter table "users" drop constraint "users_email_unique";');
    this.addSql('alter table "users" drop column "email";');
    this.addSql('alter table "users" drop column "verified_email";');
  }

}
