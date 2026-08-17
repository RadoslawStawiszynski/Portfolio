/**
 * Seed script — tworzy konta użytkowników dla Miłosza i Martyny.
 * Łączy je z istniejącymi portfolio przez pole `owner`.
 *
 * Uruchom: SEED_MILOSZ_PASSWORD=... SEED_MARTYNA_PASSWORD=... npx tsx scripts/seed-users.ts
 * Neon:    DATABASE_URL="postgresql://..." SEED_MILOSZ_PASSWORD=... SEED_MARTYNA_PASSWORD=... npx tsx scripts/seed-users.ts
 *
 * Hasła NIE są hardcodowane (były w plaintext w git — patrz historia commitów
 * sprzed 2026-08-17) — wygeneruj losowe np. `openssl rand -base64 18` i przekaż
 * przez zmienną env, ustawianą tylko w shellu, nigdy w pliku trafiającym do gita.
 * Zmienne wymagane są dopiero przy tworzeniu NOWEGO konta — rerun dla istniejących
 * userów działa bez nich.
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} env var — wygeneruj hasło (np. \`openssl rand -base64 18\`) i ustaw w shellu przed uruchomieniem`
    );
  }
  return value;
}

const USERS_TO_CREATE = [
  {
    email: "milosz@portfoliohub.dev",
    passwordEnvVar: "SEED_MILOSZ_PASSWORD",
    firstName: "Miłosz",
    lastName: "Gawlik",
    portfolioSlug: "milosz",
  },
  {
    email: "martyna.stawiszynska@gmail.com",
    passwordEnvVar: "SEED_MARTYNA_PASSWORD",
    firstName: "Martyna",
    lastName: "Stawiszyńska",
    portfolioSlug: "martyna",
  },
];

async function seed() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  for (const u of USERS_TO_CREATE) {
    // Check if user already exists
    const existingUser = await payload.find({
      collection: "users",
      where: { email: { equals: u.email } },
      limit: 1,
      overrideAccess: true,
    });

    let userId: string | number;

    if (existingUser.docs.length > 0) {
      userId = existingUser.docs[0].id;
      console.log(`↩  User already exists: ${u.email} (id: ${userId})`);
    } else {
      const password = requireEnv(u.passwordEnvVar);
      const newUser = await payload.create({
        collection: "users",
        data: {
          email: u.email,
          password,
          role: "owner",
          firstName: u.firstName,
          lastName: u.lastName,
        },
        overrideAccess: true,
      });
      userId = newUser.id;
      console.log(`✓  Created user: ${u.email} (id: ${userId})`);
    }

    // Find their portfolio and set owner
    const portfolio = await payload.find({
      collection: "portfolios",
      where: { subdomain: { equals: u.portfolioSlug } },
      limit: 1,
      overrideAccess: true,
    });

    if (!portfolio.docs.length) {
      console.warn(`⚠  Portfolio "${u.portfolioSlug}" not found — run seed-${u.portfolioSlug}.ts first`);
      continue;
    }

    const portfolioId = portfolio.docs[0].id;
    const currentOwner = portfolio.docs[0].owner;

    // Only update owner if not already set to this user
    if (currentOwner === userId || (typeof currentOwner === "object" && currentOwner?.id === userId)) {
      console.log(`↩  Portfolio "${u.portfolioSlug}" already owned by ${u.email}`);
    } else {
      await payload.update({
        collection: "portfolios",
        id: portfolioId,
        data: { owner: userId },
        overrideAccess: true,
      });
      console.log(`✓  Portfolio "${u.portfolioSlug}" owner → ${u.email}`);
    }
  }

  console.log("\n✅ Done! Użytkownicy gotowi do logowania na /admin");
  console.log("   Zmień hasła po pierwszym logowaniu przez /admin → Users");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
