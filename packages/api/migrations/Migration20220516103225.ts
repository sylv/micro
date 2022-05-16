import { Migration } from '@mikro-orm/migrations';

export class Migration20220516103225 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pastes" ("id" varchar(255) not null, "content" varchar(500000) not null, "type" varchar(255) null, "encrypted" boolean not null, "burn" boolean not null, "expires_at" bigint null, "created_at" bigint not null, "owner_id" varchar(255) null);');
    this.addSql('alter table "pastes" add constraint "pastes_pkey" primary key ("id");');

    this.addSql('alter table "pastes" add constraint "pastes_owner_id_foreign" foreign key ("owner_id") references "users" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "pastes" cascade;');
  }

}
