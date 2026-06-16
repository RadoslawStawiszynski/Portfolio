import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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

  ALTER TABLE "todos" ADD CONSTRAINT "todos_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "todos" ADD CONSTRAINT "todos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "todos_portfolio_idx" ON "todos" USING btree ("portfolio_id");
  CREATE INDEX IF NOT EXISTS "todos_owner_idx" ON "todos" USING btree ("owner_id");
  CREATE INDEX IF NOT EXISTS "todos_updated_at_idx" ON "todos" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "todos_created_at_idx" ON "todos" USING btree ("created_at");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "todos" CASCADE;
  `);
}
