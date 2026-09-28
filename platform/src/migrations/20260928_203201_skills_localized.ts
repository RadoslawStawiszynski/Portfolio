import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Pole skills stało się localized (wcześniej wspólne dla PL i EN — wersja EN nadpisywała PL).
// Idempotentna i bez utraty danych: istniejąca wartość jest kopiowana do każdej lokalizacji.
// Starej kolumny NIE usuwamy (expand/contract): wersja ze DROP wywaliła produkcję 500-tką,
// bo poprzedni kod na Vercelu jeszcze z niej czytał. Usunąć osobną migracją po wdrożeniu (TD-30).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "blocks_skills_data_categories_locales" ADD COLUMN IF NOT EXISTS "skills" varchar;

  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'blocks_skills_data_categories' AND column_name = 'skills'
    ) THEN
      UPDATE "blocks_skills_data_categories_locales" l
      SET "skills" = c."skills"
      FROM "blocks_skills_data_categories" c
      WHERE l."_parent_id" = c."id" AND l."skills" IS NULL;
    END IF;
  END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "blocks_skills_data_categories" ADD COLUMN IF NOT EXISTS "skills" varchar;

  UPDATE "blocks_skills_data_categories" c
  SET "skills" = l."skills"
  FROM "blocks_skills_data_categories_locales" l
  WHERE l."_parent_id" = c."id" AND l."_locale" = 'pl';

  ALTER TABLE "blocks_skills_data_categories_locales" DROP COLUMN IF EXISTS "skills";`)
}
