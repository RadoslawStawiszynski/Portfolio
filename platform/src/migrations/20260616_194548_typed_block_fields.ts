import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('pl', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('superadmin', 'admin', 'owner');
  CREATE TYPE "public"."enum_portfolios_type" AS ENUM('cv', 'author', 'company', 'project', 'custom');
  CREATE TYPE "public"."enum_portfolios_theme" AS ENUM('light', 'dark', 'retro-terminal', 'synthwave', 'amber', 'cyberpunk', 'teal-coral', 'earth', 'slate-rose', 'olive-gold');
  CREATE TYPE "public"."enum_portfolios_color_scheme" AS ENUM('light', 'dark', 'auto');
  CREATE TYPE "public"."enum_portfolios_language" AS ENUM('pl', 'en', 'pl-en');
  CREATE TYPE "public"."enum_blocks_type" AS ENUM('hero', 'about', 'experience', 'skills', 'education', 'contact', 'projects', 'books', 'services', 'gallery', 'testimonials', 'timeline', 'stats', 'cta', 'faq');
  CREATE TYPE "public"."enum_blocks_theme_override" AS ENUM('light', 'dark', 'retro-terminal');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'owner' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "portfolios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subdomain" varchar NOT NULL,
  	"custom_domain" varchar,
  	"owner_id" integer NOT NULL,
  	"type" "enum_portfolios_type" DEFAULT 'cv' NOT NULL,
  	"theme" "enum_portfolios_theme" DEFAULT 'light',
  	"color_scheme" "enum_portfolios_color_scheme" DEFAULT 'light',
  	"language" "enum_portfolios_language" DEFAULT 'pl',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"is_published" boolean DEFAULT false,
  	"contact_email" varchar DEFAULT 'biuro@korp-cbm.com',
  	"cv_pdf_pl" varchar,
  	"cv_pdf_en" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blocks_experience_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start_date" varchar,
  	"end_date" varchar
  );
  
  CREATE TABLE "blocks_experience_data_items_locales" (
  	"company" varchar,
  	"role" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blocks_skills_data_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"skills" varchar
  );
  
  CREATE TABLE "blocks_skills_data_categories_locales" (
  	"name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blocks_education_data_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"start_year" numeric,
  	"end_year" numeric
  );
  
  CREATE TABLE "blocks_education_data_items_locales" (
  	"school" varchar,
  	"degree" varchar,
  	"field" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "blocks" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"portfolio_id" integer NOT NULL,
  	"type" "enum_blocks_type" NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"visible" boolean DEFAULT true,
  	"theme_override" "enum_blocks_theme_override",
  	"hero_data_avatar_url" varchar,
  	"hero_data_cta_href" varchar,
  	"about_data_photo_url" varchar,
  	"contact_data_email" varchar,
  	"contact_data_phone" varchar,
  	"contact_data_linkedin" varchar,
  	"contact_data_github" varchar,
  	"contact_data_show_form" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "blocks_locales" (
  	"hero_data_title" varchar,
  	"hero_data_subtitle" varchar,
  	"hero_data_cta_label" varchar,
  	"about_data_bio" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"portfolios_id" integer,
  	"blocks_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blocks_experience_data_items" ADD CONSTRAINT "blocks_experience_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_experience_data_items_locales" ADD CONSTRAINT "blocks_experience_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_experience_data_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_skills_data_categories" ADD CONSTRAINT "blocks_skills_data_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_skills_data_categories_locales" ADD CONSTRAINT "blocks_skills_data_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_skills_data_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_education_data_items" ADD CONSTRAINT "blocks_education_data_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks_education_data_items_locales" ADD CONSTRAINT "blocks_education_data_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks_education_data_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "blocks" ADD CONSTRAINT "blocks_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blocks_locales" ADD CONSTRAINT "blocks_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolios_fk" FOREIGN KEY ("portfolios_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blocks_fk" FOREIGN KEY ("blocks_id") REFERENCES "public"."blocks"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "portfolios_subdomain_idx" ON "portfolios" USING btree ("subdomain");
  CREATE UNIQUE INDEX "portfolios_custom_domain_idx" ON "portfolios" USING btree ("custom_domain");
  CREATE INDEX "portfolios_owner_idx" ON "portfolios" USING btree ("owner_id");
  CREATE INDEX "portfolios_seo_image_idx" ON "portfolios" USING btree ("seo_image_id");
  CREATE INDEX "portfolios_updated_at_idx" ON "portfolios" USING btree ("updated_at");
  CREATE INDEX "portfolios_created_at_idx" ON "portfolios" USING btree ("created_at");
  CREATE INDEX "blocks_experience_data_items_order_idx" ON "blocks_experience_data_items" USING btree ("_order");
  CREATE INDEX "blocks_experience_data_items_parent_id_idx" ON "blocks_experience_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_experience_data_items_locales_locale_parent_id_unique" ON "blocks_experience_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blocks_skills_data_categories_order_idx" ON "blocks_skills_data_categories" USING btree ("_order");
  CREATE INDEX "blocks_skills_data_categories_parent_id_idx" ON "blocks_skills_data_categories" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_skills_data_categories_locales_locale_parent_id_uniqu" ON "blocks_skills_data_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blocks_education_data_items_order_idx" ON "blocks_education_data_items" USING btree ("_order");
  CREATE INDEX "blocks_education_data_items_parent_id_idx" ON "blocks_education_data_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "blocks_education_data_items_locales_locale_parent_id_unique" ON "blocks_education_data_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "blocks_portfolio_idx" ON "blocks" USING btree ("portfolio_id");
  CREATE INDEX "blocks_updated_at_idx" ON "blocks" USING btree ("updated_at");
  CREATE INDEX "blocks_created_at_idx" ON "blocks" USING btree ("created_at");
  CREATE UNIQUE INDEX "blocks_locales_locale_parent_id_unique" ON "blocks_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_portfolios_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolios_id");
  CREATE INDEX "payload_locked_documents_rels_blocks_id_idx" ON "payload_locked_documents_rels" USING btree ("blocks_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "portfolios" CASCADE;
  DROP TABLE "blocks_experience_data_items" CASCADE;
  DROP TABLE "blocks_experience_data_items_locales" CASCADE;
  DROP TABLE "blocks_skills_data_categories" CASCADE;
  DROP TABLE "blocks_skills_data_categories_locales" CASCADE;
  DROP TABLE "blocks_education_data_items" CASCADE;
  DROP TABLE "blocks_education_data_items_locales" CASCADE;
  DROP TABLE "blocks" CASCADE;
  DROP TABLE "blocks_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_portfolios_type";
  DROP TYPE "public"."enum_portfolios_theme";
  DROP TYPE "public"."enum_portfolios_color_scheme";
  DROP TYPE "public"."enum_portfolios_language";
  DROP TYPE "public"."enum_blocks_type";
  DROP TYPE "public"."enum_blocks_theme_override";`)
}
