import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_blocks_projects_data_items_status" AS ENUM('completed', 'in-progress', 'archived');
  CREATE TYPE "public"."enum_waitlist_requests_status" AS ENUM('pending', 'invited', 'rejected');
  CREATE TYPE "public"."enum_invitation_tokens_status" AS ENUM('active', 'used', 'expired');
  CREATE TABLE "blocks_projects_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tags" varchar,
  	"url" varchar,
  	"github_url" varchar,
  	"status" "enum_blocks_projects_data_items_status" DEFAULT 'completed'
  );
  
  CREATE TABLE "blocks_projects_data_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blocks_services_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"price" varchar
  );
  
  CREATE TABLE "blocks_services_data_items_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blocks_books_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"cover_url" varchar,
  	"buy_url" varchar,
  	"is_available" boolean DEFAULT true
  );
  
  CREATE TABLE "blocks_books_data_items_locales" (
  	"title" varchar,
  	"description" varchar,
  	"genre" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blocks_gallery_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_url" varchar,
  	"alt" varchar
  );
  
  CREATE TABLE "blocks_gallery_data_items_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "todos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"done" boolean DEFAULT false,
  	"portfolio_id" integer,
  	"owner_id" integer NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "waitlist_requests" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"note" varchar,
  	"status" "enum_waitlist_requests_status" DEFAULT 'pending' NOT NULL,
  	"invited_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "invitation_tokens" (
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
  
  CREATE TABLE "platform_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"invitations_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "blocks" ADD COLUMN "contact_data_facebook" varchar;
  ALTER TABLE "blocks" ADD COLUMN "contact_data_instagram" varchar;
  ALTER TABLE "blocks" ADD COLUMN "contact_data_goodreads" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "todos_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "waitlist_requests_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "invitation_tokens_id" integer;
  ALTER TABLE "blocks_projects_data_items" ADD CONSTRAINT "blocks_projects_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_projects_data_items_locales" ADD CONSTRAINT "blocks_projects_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_projects_data_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_services_data_items" ADD CONSTRAINT "blocks_services_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_services_data_items_locales" ADD CONSTRAINT "blocks_services_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_services_data_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_books_data_items" ADD CONSTRAINT "blocks_books_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_books_data_items_locales" ADD CONSTRAINT "blocks_books_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_books_data_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_gallery_data_items" ADD CONSTRAINT "blocks_gallery_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_gallery_data_items_locales" ADD CONSTRAINT "blocks_gallery_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_gallery_data_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "todos" ADD CONSTRAINT "todos_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "todos" ADD CONSTRAINT "todos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invitation_tokens" ADD CONSTRAINT "invitation_tokens_waitlist_ref_id_waitlist_requests_id_fk" FOREIGN KEY ("waitlist_ref_id") REFERENCES "public"."waitlist_requests"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "blocks_projects_data_items_order_idx" ON "blocks_projects_data_items" USING btree ("_order");
  CREATE INDEX "blocks_projects_data_items_parent_id_idx" ON "blocks_projects_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_projects_data_items_locales_locale_parent_id_unique" ON "blocks_projects_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blocks_services_data_items_order_idx" ON "blocks_services_data_items" USING btree ("_order");
  CREATE INDEX "blocks_services_data_items_parent_id_idx" ON "blocks_services_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_services_data_items_locales_locale_parent_id_unique" ON "blocks_services_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blocks_books_data_items_order_idx" ON "blocks_books_data_items" USING btree ("_order");
  CREATE INDEX "blocks_books_data_items_parent_id_idx" ON "blocks_books_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_books_data_items_locales_locale_parent_id_unique" ON "blocks_books_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blocks_gallery_data_items_order_idx" ON "blocks_gallery_data_items" USING btree ("_order");
  CREATE INDEX "blocks_gallery_data_items_parent_id_idx" ON "blocks_gallery_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_gallery_data_items_locales_locale_parent_id_unique" ON "blocks_gallery_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "todos_portfolio_idx" ON "todos" USING btree ("portfolio_id");
  CREATE INDEX "todos_owner_idx" ON "todos" USING btree ("owner_id");
  CREATE INDEX "todos_updated_at_idx" ON "todos" USING btree ("updated_at");
  CREATE INDEX "todos_created_at_idx" ON "todos" USING btree ("created_at");
  CREATE UNIQUE INDEX "waitlist_requests_email_idx" ON "waitlist_requests" USING btree ("email");
  CREATE INDEX "waitlist_requests_updated_at_idx" ON "waitlist_requests" USING btree ("updated_at");
  CREATE INDEX "waitlist_requests_created_at_idx" ON "waitlist_requests" USING btree ("created_at");
  CREATE UNIQUE INDEX "invitation_tokens_token_idx" ON "invitation_tokens" USING btree ("token");
  CREATE INDEX "invitation_tokens_waitlist_ref_idx" ON "invitation_tokens" USING btree ("waitlist_ref_id");
  CREATE INDEX "invitation_tokens_updated_at_idx" ON "invitation_tokens" USING btree ("updated_at");
  CREATE INDEX "invitation_tokens_created_at_idx" ON "invitation_tokens" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_todos_fk" FOREIGN KEY ("todos_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_waitlist_requests_fk" FOREIGN KEY ("waitlist_requests_id") REFERENCES "public"."waitlist_requests"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invitation_tokens_fk" FOREIGN KEY ("invitation_tokens_id") REFERENCES "public"."invitation_tokens"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_todos_id_idx" ON "payload_locked_documents_rels" USING btree ("todos_id");
  CREATE INDEX "payload_locked_documents_rels_waitlist_requests_id_idx" ON "payload_locked_documents_rels" USING btree ("waitlist_requests_id");
  CREATE INDEX "payload_locked_documents_rels_invitation_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("invitation_tokens_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "blocks_projects_data_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_projects_data_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_services_data_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_services_data_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_books_data_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_books_data_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_gallery_data_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "blocks_gallery_data_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "todos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "waitlist_requests" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "invitation_tokens" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "platform_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blocks_projects_data_items" CASCADE;
  DROP TABLE "blocks_projects_data_items_locales" CASCADE;
  DROP TABLE "blocks_services_data_items" CASCADE;
  DROP TABLE "blocks_services_data_items_locales" CASCADE;
  DROP TABLE "blocks_books_data_items" CASCADE;
  DROP TABLE "blocks_books_data_items_locales" CASCADE;
  DROP TABLE "blocks_gallery_data_items" CASCADE;
  DROP TABLE "blocks_gallery_data_items_locales" CASCADE;
  DROP TABLE "todos" CASCADE;
  DROP TABLE "waitlist_requests" CASCADE;
  DROP TABLE "invitation_tokens" CASCADE;
  DROP TABLE "platform_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_todos_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_waitlist_requests_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_invitation_tokens_fk";
  
  DROP INDEX "payload_locked_documents_rels_todos_id_idx";
  DROP INDEX "payload_locked_documents_rels_waitlist_requests_id_idx";
  DROP INDEX "payload_locked_documents_rels_invitation_tokens_id_idx";
  ALTER TABLE "blocks" DROP COLUMN "contact_data_facebook";
  ALTER TABLE "blocks" DROP COLUMN "contact_data_instagram";
  ALTER TABLE "blocks" DROP COLUMN "contact_data_goodreads";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "todos_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "waitlist_requests_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "invitation_tokens_id";
  DROP TYPE "public"."enum_blocks_projects_data_items_status";
  DROP TYPE "public"."enum_waitlist_requests_status";
  DROP TYPE "public"."enum_invitation_tokens_status";`)
}
