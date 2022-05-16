import { Migration } from '@mikro-orm/migrations';

export class Migration20220516110142 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pastes" rename column "type" to "extension";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "pastes" rename column "extension" to "type";');
  }

}
