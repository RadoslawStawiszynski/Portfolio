import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Idempotentna (IF NOT EXISTS / DO-block guardy) — Neon prod miał częściowy,
// nieznany stan schematu (np. enum "projects" już istniał z wcześniejszego
// dev-push), więc pierwsza (nie-idempotentna) wersja tej migracji wywaliła się
// w środku transakcji na "type already exists" (bezpiecznie — cała transakcja
// się wycofała, brak zmian). Ta wersja bezpiecznie pomija to co już istnieje.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_blocks_projects_data_items_status" AS ENUM('completed', 'in-progress', 'archived');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_waitlist_requests_status" AS ENUM('pending', 'invited', 'rejected');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_invitation_tokens_status" AS ENUM('active', 'used', 'expired');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "blocks_projects_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tags" varchar,
  	"url" varchar,
  	"github_url" varchar,
  	"status" "enum_blocks_projects_data_items_status" DEFAULT 'completed'
  );

  CREATE TABLE IF NOT EXISTS "blocks_projects_data_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "blocks_services_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"price" varchar
  );

  CREATE TABLE IF NOT EXISTS "blocks_services_data_items_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "blocks_books_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"cover_url" varchar,
  	"buy_url" varchar,
  	"is_available" boolean DEFAULT true
  );

  CREATE TABLE IF NOT EXISTS "blocks_books_data_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"genre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "blocks_gallery_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_url" varchar,
  	"alt" varchar
  );

  CREATE TABLE IF NOT EXISTS "blocks_gallery_data_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "todos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"done" boolean DEFAULT false,
  	"portfolio_id" integer,
  	"owner_id" integer NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "waitlist_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"note" varchar,
  	"status" "enum_waitlist_requests_status" DEFAULT 'pending' NOT NULL,
  	"invited_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "invitation_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"token" varchar NOT NULL,
  	"waitlist_ref_id" integer NOT NULL,
  	"email" varchar NOT NULL,
  	"status" "enum_invitation_tokens_status" DEFAULT 'active' NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"used_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "platform_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"invitations_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "blocks" ADD COLUMN IF NOT EXISTS "contact_data_facebook" varchar;
  ALTER TABLE "blocks" ADD COLUMN IF NOT EXISTS "contact_data_instagram" varchar;
  ALTER TABLE "blocks" ADD COLUMN IF NOT EXISTS "contact_data_goodreads" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "todos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "waitlist_requests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "invitation_tokens_id" integer;

  DO $$ BEGIN
    ALTER TABLE "blocks_projects_data_items" ADD CONSTRAINT "blocks_projects_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_projects_data_items_locales" ADD CONSTRAINT "blocks_projects_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_projects_data_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_services_data_items" ADD CONSTRAINT "blocks_services_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_services_data_items_locales" ADD CONSTRAINT "blocks_services_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_services_data_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_books_data_items" ADD CONSTRAINT "blocks_books_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_books_data_items_locales" ADD CONSTRAINT "blocks_books_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_books_data_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_gallery_data_items" ADD CONSTRAINT "blocks_gallery_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "blocks_gallery_data_items_locales" ADD CONSTRAINT "blocks_gallery_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_gallery_data_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "todos" ADD CONSTRAINT "todos_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "todos" ADD CONSTRAINT "todos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "invitation_tokens" ADD CONSTRAINT "invitation_tokens_waitlist_ref_id_waitlist_requests_id_fk" FOREIGN KEY ("waitlist_ref_id") REFERENCES "public"."waitlist_requests"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_todos_fk" FOREIGN KEY ("todos_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waitlist_requests_fk" FOREIGN KEY ("waitlist_requests_id") REFERENCES "public"."waitlist_requests"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invitation_tokens_fk" FOREIGN KEY ("invitation_tokens_id") REFERENCES "public"."invitation_tokens"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "blocks_projects_data_items_order_idx" ON "blocks_projects_data_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blocks_projects_data_items_parent_id_idx" ON "blocks_projects_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blocks_projects_data_items_locales_locale_parent_id_unique" ON "blocks_projects_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "blocks_services_data_items_order_idx" ON "blocks_services_data_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blocks_services_data_items_parent_id_idx" ON "blocks_services_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blocks_services_data_items_locales_locale_parent_id_unique" ON "blocks_services_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "blocks_books_data_items_order_idx" ON "blocks_books_data_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blocks_books_data_items_parent_id_idx" ON "blocks_books_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blocks_books_data_items_locales_locale_parent_id_unique" ON "blocks_books_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "blocks_gallery_data_items_order_idx" ON "blocks_gallery_data_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "blocks_gallery_data_items_parent_id_idx" ON "blocks_gallery_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "blocks_gallery_data_items_locales_locale_parent_id_unique" ON "blocks_gallery_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "todos_portfolio_idx" ON "todos" USING btree ("portfolio_id");
  CREATE INDEX IF NOT EXISTS "todos_owner_idx" ON "todos" USING btree ("owner_id");
  CREATE INDEX IF NOT EXISTS "todos_updated_at_idx" ON "todos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "todos_created_at_idx" ON "todos" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_requests_email_idx" ON "waitlist_requests" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "waitlist_requests_updated_at_idx" ON "waitlist_requests" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "waitlist_requests_created_at_idx" ON "waitlist_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "invitation_tokens_token_idx" ON "invitation_tokens" USING btree ("token");
  CREATE INDEX IF NOT EXISTS "invitation_tokens_waitlist_ref_idx" ON "invitation_tokens" USING btree ("waitlist_ref_id");
  CREATE INDEX IF NOT EXISTS "invitation_tokens_updated_at_idx" ON "invitation_tokens" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "invitation_tokens_created_at_idx" ON "invitation_tokens" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_todos_id_idx" ON "payload_locked_documents_rels" USING btree ("todos_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_waitlist_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("waitlist_requests_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_invitation_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("invitation_tokens_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "blocks_projects_data_items" CASCADE;
  DROP TABLE IF EXISTS "blocks_projects_data_items_locales" CASCADE;
  DROP TABLE IF EXISTS "blocks_services_data_items" CASCADE;
  DROP TABLE IF EXISTS "blocks_services_data_items_locales" CASCADE;
  DROP TABLE IF EXISTS "blocks_books_data_items" CASCADE;
  DROP TABLE IF EXISTS "blocks_books_data_items_locales" CASCADE;
  DROP TABLE IF EXISTS "blocks_gallery_data_items" CASCADE;
  DROP TABLE IF EXISTS "blocks_gallery_data_items_locales" CASCADE;
  DROP TABLE IF EXISTS "todos" CASCADE;
  DROP TABLE IF EXISTS "waitlist_requests" CASCADE;
  DROP TABLE IF EXISTS "invitation_tokens" CASCADE;
  DROP TABLE IF EXISTS "platform_settings" CASCADE;

  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_todos_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_waitlist_requests_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_invitation_tokens_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_todos_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_waitlist_requests_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_invitation_tokens_id_idx";

  ALTER TABLE "blocks" DROP COLUMN IF EXISTS "contact_data_facebook";
  ALTER TABLE "blocks" DROP COLUMN IF EXISTS "contact_data_instagram";
  ALTER TABLE "blocks" DROP COLUMN IF EXISTS "contact_data_goodreads";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "todos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "waitlist_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "invitation_tokens_id";

  DROP TYPE IF EXISTS "public"."enum_blocks_projects_data_items_status";
  DROP TYPE IF EXISTS "public"."enum_waitlist_requests_status";
  DROP TYPE IF EXISTS "public"."enum_invitation_tokens_status";
  `)
}
