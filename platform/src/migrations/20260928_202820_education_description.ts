// Idempotentna (IF NOT EXISTS) — Neon miał już raz nieznany stan schematu (patrz migracja Fazy 4).
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blocks_education_data_items_locales" ADD COLUMN IF NOT EXISTS "description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blocks_education_data_items_locales" DROP COLUMN IF EXISTS "description";`)
}
