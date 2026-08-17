/**
 * Rotacja hasła istniejącego użytkownika (np. przed UAT, po incydencie).
 *
 * Payload nie ma wpiętego email adaptera (patrz payload.config.ts) — wbudowany
 * "forgot password" tylko loguje link resetu do konsoli, nie wysyła maila.
 * Ten skrypt to prostszy, kontrolowany sposób na zmianę hasła bez zależności od maila.
 *
 * Uruchom lokalnie:
 *   ROTATE_EMAIL=milosz@portfoliohub.dev ROTATE_PASSWORD="$(openssl rand -base64 18)" npx tsx scripts/rotate-user-password.ts
 * Na Neon (prod):
 *   DATABASE_URL="postgresql://..." ROTATE_EMAIL=... ROTATE_PASSWORD=... npx tsx scripts/rotate-user-password.ts
 *
 * Nowe hasło przekaż użytkownikowi bezpośrednim kanałem (telefon/Signal) — nigdy przez git/email w plaintext.
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} env var`);
  return value;
}

async function rotate() {
  const email = requireEnv("ROTATE_EMAIL");
  const password = requireEnv("ROTATE_PASSWORD");

  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  });

  if (!existing.docs.length) {
    console.error(`✗  User not found: ${email}`);
    process.exit(1);
  }

  await payload.update({
    collection: "users",
    id: existing.docs[0].id,
    data: { password },
    overrideAccess: true,
  });

  console.log(`✓  Hasło zrotowane dla: ${email}`);
  console.log("   Przekaż nowe hasło użytkownikowi bezpośrednim kanałem, nie przez git/email.");
  process.exit(0);
}

rotate().catch((err) => {
  console.error("Rotate failed:", err);
  process.exit(1);
});
