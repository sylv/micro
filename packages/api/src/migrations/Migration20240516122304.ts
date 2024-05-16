import { Migration } from '@mikro-orm/migrations';

export class Migration20240516122304 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pastes" alter column "expires_at" type timestamptz using ("expires_at"::timestamptz);');
    this.addSql('alter table "pastes" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');

    this.addSql('alter table "links" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');

    this.addSql('alter table "invites" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "invites" alter column "expires_at" type timestamptz using ("expires_at"::timestamptz);');

    this.addSql('alter table "files" add column "views" int not null default 0, add column "is_external" boolean not null default false;');
    this.addSql('alter table "files" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');

    this.addSql('alter table "thumbnails" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');

    this.addSql('alter table "users_verification" alter column "expires_at" type timestamptz using ("expires_at"::timestamptz);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pastes" alter column "expires_at" type timestamptz(0) using ("expires_at"::timestamptz(0));');
    this.addSql('alter table "pastes" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');

    this.addSql('alter table "links" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');

    this.addSql('alter table "invites" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "invites" alter column "expires_at" type timestamptz(0) using ("expires_at"::timestamptz(0));');

    this.addSql('alter table "files" drop column "views", drop column "is_external";');

    this.addSql('alter table "files" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');

    this.addSql('alter table "thumbnails" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');

    this.addSql('alter table "users_verification" alter column "expires_at" type timestamptz(0) using ("expires_at"::timestamptz(0));');
  }

}
