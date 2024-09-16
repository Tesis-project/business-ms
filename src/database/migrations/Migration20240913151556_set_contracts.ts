import { Migration } from '@mikro-orm/migrations';

export class Migration20240913151556_set_contracts extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "contracts" ("_id" uuid not null default gen_random_uuid(), "contratist" jsonb not null, "contractor" jsonb not null, "details" jsonb null, "status" text check ("status" in (\'PLANNING\', \'SINGS_PENDING\', \'IN_PROGRESS\', \'CANCELLED\', \'COMPLETED\')) not null default \'PLANNING\', "created_at" timestamptz not null default \'2024-09-13 11:15:56\', "updated_at" timestamptz not null default \'2024-09-13 11:15:56\', "vacant__id" uuid null, constraint "contracts_pkey" primary key ("_id"));');
    this.addSql('alter table "contracts" add constraint "contracts_vacant__id_unique" unique ("vacant__id");');

    this.addSql('alter table "contracts" add constraint "contracts_vacant__id_foreign" foreign key ("vacant__id") references "vacants" ("_id") on update cascade on delete cascade;');

    this.addSql('alter table "vacants" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "vacants" alter column "created_at" set default \'2024-09-13 11:15:56\';');
    this.addSql('alter table "vacants" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "vacants" alter column "updated_at" set default \'2024-09-13 11:15:56\';');

    this.addSql('alter table "postulations" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "postulations" alter column "created_at" set default \'2024-09-13 11:15:56\';');
    this.addSql('alter table "postulations" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "postulations" alter column "updated_at" set default \'2024-09-13 11:15:56\';');
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "contracts" cascade;');

    this.addSql('alter table "vacants" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "vacants" alter column "created_at" set default \'2024-09-05 07:33:49\';');
    this.addSql('alter table "vacants" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "vacants" alter column "updated_at" set default \'2024-09-05 07:33:49\';');

    this.addSql('alter table "postulations" alter column "created_at" type timestamptz using ("created_at"::timestamptz);');
    this.addSql('alter table "postulations" alter column "created_at" set default \'2024-09-05 07:33:48\';');
    this.addSql('alter table "postulations" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);');
    this.addSql('alter table "postulations" alter column "updated_at" set default \'2024-09-05 07:33:48\';');
  }

}
