import { Migration } from '@mikro-orm/migrations';

export class Migration20221006070931 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "users" add column "otp_secret" varchar(255) null, add column "otp_enabled" boolean not null default false, add column "otp_recovery_codes" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "users" drop column "otp_secret";');
    this.addSql('alter table "users" drop column "otp_enabled";');
    this.addSql('alter table "users" drop column "otp_recovery_codes";');
  }

}
