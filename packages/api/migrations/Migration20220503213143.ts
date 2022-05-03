import { Migration } from '@mikro-orm/migrations';

export class Migration20220503213143 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "invite" ("id" varchar(255) not null, "permissions" int null, "inviter_id" varchar(255) null, "invited_id" varchar(255) null, "created_at" bigint not null, "expires_at" bigint null);');
    this.addSql('alter table "invite" add constraint "invite_invited_id_unique" unique ("invited_id");');
    this.addSql('alter table "invite" add constraint "invite_pkey" primary key ("id");');

    this.addSql('create table "users" ("id" varchar(255) not null, "username" varchar(255) not null, "permissions" int not null, "password" varchar(255) not null, "secret" varchar(255) not null, "invite_id" varchar(255) not null, "tags" text[] not null);');
    this.addSql('create index "users_username_index" on "users" ("username");');
    this.addSql('alter table "users" add constraint "users_username_unique" unique ("username");');
    this.addSql('alter table "users" add constraint "users_invite_id_unique" unique ("invite_id");');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');

    this.addSql('create table "files" ("id" varchar(255) not null, "type" varchar(255) not null, "size" int not null, "hash" varchar(255) not null, "host" varchar(255) null, "delete_key" varchar(255) not null, "name" varchar(255) null, "thumbnail_file_id" varchar(255) null, "owner_id" varchar(255) not null, "created_at" bigint not null);');
    this.addSql('alter table "files" add constraint "files_thumbnail_file_id_unique" unique ("thumbnail_file_id");');
    this.addSql('alter table "files" add constraint "files_pkey" primary key ("id");');

    this.addSql('create table "thumbnails" ("file_id" varchar(255) not null, "size" int not null, "duration" int not null, "data" bytea not null, "created_at" bigint not null);');
    this.addSql('alter table "thumbnails" add constraint "thumbnails_pkey" primary key ("file_id");');

    this.addSql('alter table "invite" add constraint "invite_inviter_id_foreign" foreign key ("inviter_id") references "users" ("id") on update cascade on delete set null;');
    this.addSql('alter table "invite" add constraint "invite_invited_id_foreign" foreign key ("invited_id") references "users" ("id") on update cascade on delete set null;');

    this.addSql('alter table "users" add constraint "users_invite_id_foreign" foreign key ("invite_id") references "invite" ("id") on update cascade;');

    this.addSql('alter table "files" add constraint "files_thumbnail_file_id_foreign" foreign key ("thumbnail_file_id") references "thumbnails" ("file_id") on update cascade on delete set null;');
    this.addSql('alter table "files" add constraint "files_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade;');

    this.addSql('alter table "thumbnails" add constraint "thumbnails_file_id_foreign" foreign key ("file_id") references "files" ("id") on update cascade on delete cascade;');
  }

}
