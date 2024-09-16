import { Migration } from '@mikro-orm/migrations';

export class Migration20240905113349_set_business extends Migration {

  override async up(): Promise<void> {
    this.addSql('create table "vacants" ("_id" uuid not null default gen_random_uuid(), "vacant_pic" jsonb null, "title" varchar(255) not null, "desc" text not null, "status" text check ("status" in (\'OPEN\', \'CLOSED\', \'EXPIRED\', \'INPROGRESS\')) not null default \'OPEN\', "created_at" timestamptz not null default \'2024-09-05 07:33:49\', "updated_at" timestamptz not null default \'2024-09-05 07:33:49\', "operation" jsonb not null default \'{"start_at":"","end_at":""}\', "role_desc" text not null, "role_type" jsonb not null default \'["SINGER"]\', "transport_service" jsonb null, "housing_service" jsonb null, "vacant_costs" jsonb null, "vacant_payment" jsonb not null default \'{"total":0,"currency":"USD"}\', "direction" jsonb null, "specific_conditions" text null, "owner" varchar(255) not null, constraint "vacants_pkey" primary key ("_id"));');

    this.addSql('create table "postulations" ("_id" uuid not null default gen_random_uuid(), "comment" text null, "status" text check ("status" in (\'SENDED\', \'ON_HOLD\', \'ACCEPTED\', \'CONTRACT_SENT\', \'REFUSED\')) not null default \'SENDED\', "owner_comment" text null, "created_at" timestamptz not null default \'2024-09-05 07:33:48\', "updated_at" timestamptz not null default \'2024-09-05 07:33:48\', "vacant__id" uuid null, "user_postulate" varchar(255) not null, constraint "postulations_pkey" primary key ("_id"));');

    this.addSql('alter table "postulations" add constraint "postulations_vacant__id_foreign" foreign key ("vacant__id") references "vacants" ("_id") on update cascade on delete cascade;');
  }

  override async down(): Promise<void> {
    this.addSql('alter table "postulations" drop constraint "postulations_vacant__id_foreign";');

    this.addSql('drop table if exists "vacants" cascade;');

    this.addSql('drop table if exists "postulations" cascade;');
  }

}
