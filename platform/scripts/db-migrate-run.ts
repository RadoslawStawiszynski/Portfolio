/**
 * Odpala pending migracje (odpowiednik `payload migrate`), którego CLI crashuje
 * pod Node 24 w tym środowisku (patrz db-migrate-create.ts).
 *
 * Uruchom lokalnie: npx tsx scripts/db-migrate-run.ts
 * Na Neon (prod):   DATABASE_URL="postgresql://..." npx tsx scripts/db-migrate-run.ts
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

async function run() {
  const payloadModule = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const config = await configPromise;

  process.env.PAYLOAD_MIGRATING = "true";
  await payloadModule.default.init({
    config,
    disableOnInit: true,
  });

  const payload = payloadModule.default;
  const adapter = payload.db as unknown as { migrate: () => Promise<void> };

  await adapter.migrate();
  console.log("✓ Migrations applied.");
  process.exit(0);
}

run().catch((err) => {
  console.error("Migration run failed:", err);
  process.exit(1);
});
