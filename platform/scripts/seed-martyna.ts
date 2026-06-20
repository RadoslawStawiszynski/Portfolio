/**
 * Seed script — tworzy portfolio "martyna" z blokami przez Payload Local API.
 * Uruchom: npx tsx scripts/seed-martyna.ts
 * Neon:    DATABASE_URL="postgresql://..." npx tsx scripts/seed-martyna.ts
 *
 * Uwaga: dane częściowo robocze (poziom wiarygodności: medium).
 * Uzupełnij social linki i bibliografię przez /admin → Blocks gdy Martyna potwierdzi.
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

async function seed() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  const users = await payload.find({
    collection: "users",
    where: { role: { equals: "superadmin" } },
    limit: 1,
    overrideAccess: true,
  });

  if (!users.docs.length) {
    console.error("Brak superadmina — wejdź na /admin i utwórz konto.");
    process.exit(1);
  }

  const ownerId = users.docs[0].id;
  console.log(`✓ Owner: ${users.docs[0].email} (id: ${ownerId})`);

  const existing = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: "martyna" } },
    limit: 1,
    overrideAccess: true,
  });

  let portfolioId: string | number;

  if (existing.docs.length) {
    portfolioId = existing.docs[0].id;
    console.log(`✓ Portfolio "martyna" już istnieje (id: ${portfolioId})`);
  } else {
    const portfolio = await payload.create({
      collection: "portfolios",
      data: {
        subdomain: "martyna",
        owner: ownerId,
        type: "author",
        theme: "light",
        colorScheme: "light",
        language: "pl-en",
        isPublished: true,
        seoTitle: "Martyna Stawiszyńska (NancyM) — Autorka",
        seoDescription:
          "Autorka literatury młodzieżowej i obyczajowej. Książki: Zapomniany takt, seria Ten drugi ty. Opowieści, w których emocje brzmią jak muzyka.",
      },
      overrideAccess: true,
    });
    portfolioId = portfolio.id;
    console.log(`✓ Utworzono portfolio "martyna" (id: ${portfolioId})`);
  }

  const existingBlocks = await payload.find({
    collection: "blocks",
    where: { portfolio: { equals: portfolioId } },
    limit: 1,
    overrideAccess: true,
  });

  if (existingBlocks.docs.length > 0) {
    console.log("✓ Bloki już istnieją — pomijam.");
    console.log("\n✅ Seed zakończony.");
    process.exit(0);
  }

  console.log("\nTworzę bloki...");

  // Hero
  const hero = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "hero",
      order: 10,
      visible: true,
      heroData: {
        title: "Martyna Stawiszyńska",
        subtitle: "NancyM — autorka opowieści, w których emocje brzmią jak muzyka",
        ctaLabel: "Moje książki",
        ctaHref: "#about",
      },
    },
    overrideAccess: true,
  });
  await payload.update({
    collection: "blocks",
    id: hero.id,
    locale: "en",
    data: {
      heroData: {
        title: "Martyna Stawiszyńska",
        subtitle: "NancyM — stories where emotions sound like music",
        ctaLabel: "My books",
        ctaHref: "#about",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ hero (order: 10)");

  // About
  const about = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "about",
      order: 20,
      visible: true,
      aboutData: {
        bio: "Piszę od lat szkolnych — najpierw dla siebie, potem dla czytelników. Tworzę literaturę młodzieżową i obyczajową, w której emocje, relacje i muzyka splatają się w jedną historię. Publikuję online od 2017 roku. Moja pierwsza wydana powieść \"Zapomniany takt\" (Papierowe Serca, 2024) opowiada historię Nancy — dziewczyny z Cambridgeshire, dla której muzyka jest zarówno ucieczką, jak i przeznaczeniem.",
      },
    },
    overrideAccess: true,
  });
  await payload.update({
    collection: "blocks",
    id: about.id,
    locale: "en",
    data: {
      aboutData: {
        bio: "I have been writing since my school years — first for myself, then for readers. I create young adult and contemporary fiction where emotions, relationships and music intertwine into one story. Publishing online since 2017. My debut novel \"Zapomniany takt\" (Papierowe Serca, 2024) tells the story of Nancy — a girl from Cambridgeshire for whom music is both an escape and a destiny.",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ about (order: 20)");

  // Skills — dla autora używamy jako "Twórczość"
  const skills = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "skills",
      order: 30,
      visible: true,
      skillsData: {
        categories: [
          {
            name: "Gatunki",
            skills: "Literatura młodzieżowa\nPowieść obyczajowa\nRomans\nFantasy (elementy)",
          },
          {
            name: "Wydane książki",
            skills: "Zapomniany takt (Papierowe Serca, 2024)\nTen drugi ty. Tom 1 (Lekkie Wydawnictwo)\nTen drugi ty. Tom 2 (Lekkie Wydawnictwo)",
          },
          {
            name: "Aktywność",
            skills: "Publikacje online od 2017\nSpotykania autorskie\nMBP Tczew (07.2024)",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  await payload.update({
    collection: "blocks",
    id: skills.id,
    locale: "en",
    data: {
      skillsData: {
        categories: [
          {
            name: "Genres",
            skills: "Young Adult Fiction\nContemporary Fiction\nRomance\nFantasy (elements)",
          },
          {
            name: "Published Books",
            skills: "Zapomniany takt (Papierowe Serca, 2024)\nTen drugi ty. Vol. 1 (Lekkie Wydawnictwo)\nTen drugi ty. Vol. 2 (Lekkie Wydawnictwo)",
          },
          {
            name: "Activity",
            skills: "Online publishing since 2017\nAuthor meetings\nMBP Tczew (07.2024)",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ skills → twórczość (order: 30)");

  // Contact
  await payload.create({
    collection: "blocks",
    data: {
      portfolio: portfolioId,
      type: "contact",
      order: 40,
      visible: true,
      contactData: {
        email: "kontakt@nancym.pl",
        showForm: true,
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ contact (order: 40) — uzupełnij email w /admin");

  console.log("\n✅ Seed zakończony — 4 bloki utworzone.");
  console.log("   Lokalnie:   http://localhost:3000/dev/martyna");
  console.log("   Produkcja:  https://martyna.korp-cbm.com");
  console.log("   ⚠ Uzupełnij: email kontaktowy, linki social media w /admin → Blocks");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
