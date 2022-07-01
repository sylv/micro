import { Migration } from '@mikro-orm/migrations';

export class Migration20220630072906 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "users_secret_index" on "users" ("secret");');

    this.addSql('create index "files_owner_id_index" on "files" ("owner_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "users_secret_index";');

    this.addSql('drop index "files_owner_id_index";');
  }

}
