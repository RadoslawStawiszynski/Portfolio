/**
 * Seed script — tworzy konta użytkowników dla Miłosza i Martyny.
 * Łączy je z istniejącymi portfolio przez pole `owner`.
 *
 * Uruchom: npx tsx scripts/seed-users.ts
 * Neon:    DATABASE_URL="postgresql://..." npx tsx scripts/seed-users.ts
 *
 * Domyślne hasła (zmień po pierwszym logowaniu!):
 *   Miłosz:  milosz@portfoliohub.dev / Zmien123!
 *   Martyna: martyna.stawiszynska@gmail.com / Zmien123!
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

const USERS_TO_CREATE = [
  {
    email: "milosz@portfoliohub.dev",
    password: "Zmien123!",
    firstName: "Miłosz",
    lastName: "Gawlik",
    portfolioSlug: "milosz",
  },
  {
    email: "martyna.stawiszynska@gmail.com",
    password: "Zmien123!",
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
      const newUser = await payload.create({
        collection: "users",
        data: {
          email: u.email,
          password: u.password,
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
