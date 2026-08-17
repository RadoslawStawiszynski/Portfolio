/**
 * Generuje migrację Payload/Drizzle — diff między aktualną bazą (DATABASE_URL)
 * a schematem zdefiniowanym w payload.config.ts. Odpowiednik `payload migrate:create`,
 * którego CLI (node_modules/payload/dist/bin) crashuje pod Node 24 w tym środowisku
 * (tsx custom loader hook błąd: ENOENT node:fs?tsx-namespace=...).
 *
 * Uruchom: DATABASE_URL="postgresql://..." npx tsx scripts/db-migrate-create.ts <nazwa>
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

async function run() {
  const migrationName = process.argv[2];
  if (!migrationName) {
    console.error("Usage: npx tsx scripts/db-migrate-create.ts <migration-name>");
    process.exit(1);
  }

  const payloadModule = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const config = await configPromise;

  process.env.PAYLOAD_MIGRATING = "true";
  await payloadModule.default.init({
    config,
    disableDBConnect: true,
    disableOnInit: true,
  });

  const payload = payloadModule.default;
  const adapter = payload.db as unknown as {
    createMigration: (args: { migrationName: string; payload: unknown }) => Promise<void>;
  };

  await adapter.createMigration({ migrationName, payload });
  console.log("✓ Migration file created — sprawdź src/migrations/ przed uruchomieniem.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration create failed:", err);
  process.exit(1);
});
