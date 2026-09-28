-- Hotfix 2026-09-28: migracja skills_localized usunęła blocks_skills_data_categories.skills,
-- z której czyta jeszcze stary kod na produkcji (500). Przywraca kolumnę z danymi (PL),
-- dzięki czemu stary i nowy kod działają równolegle. Idempotentny.
ALTER TABLE "blocks_skills_data_categories" ADD COLUMN IF NOT EXISTS "skills" varchar;

UPDATE "blocks_skills_data_categories" c
SET "skills" = l."skills"
FROM "blocks_skills_data_categories_locales" l
WHERE l."_parent_id" = c."id" AND l."_locale" = 'pl';
