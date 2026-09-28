/**
 * Ochrona danych osobowych osób trzecich (Miłosz, Martyna) — 2026-09-28.
 *
 *  1. wycofuje publikację portfoli "milosz" i "martyna" (isPublished=false) — ich strony
 *     jeszcze nie działają, a dane osobowe nie mogą być publiczne;
 *  2. usuwa zdania wspominające te osoby z tekstów w publicznym portfolio "radek"
 *     (blok projects, obie lokalizacje).
 *
 * Idempotentny. Wypisuje, co zmienił, i kończy błędem, jeśli po zmianie coś zostało.
 *
 * Uruchom: npx tsx scripts/privacy-fix.ts
 * Neon:    DATABASE_URL="postgresql://..." npx tsx scripts/privacy-fix.ts
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

const UNPUBLISH = ["milosz", "martyna"];
// Imiona/nazwiska osób trzecich; celowo bez "Stawiszyński" (właściciel portfolio radek).
const THIRD_PARTY = /Martyn\w*|Miłosz\w*|Milosz\w*|Gawlik\w*|Stawiszyńsk(?:a|iej|ą)\b/i;

function scrubSentences(text: string): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !THIRD_PARTY.test(sentence))
    .join(" ")
    .trim();
}

async function run() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  for (const slug of UNPUBLISH) {
    const res = await payload.find({
      collection: "portfolios",
      where: { subdomain: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (!res.docs.length) {
      console.log(`  - ${slug}: brak portfolio, pomijam`);
      continue;
    }
    const doc = res.docs[0];
    if (doc.isPublished) {
      await payload.update({
        collection: "portfolios",
        id: doc.id,
        data: { isPublished: false },
        overrideAccess: true,
      });
      console.log(`  ✓ ${slug}: isPublished true → false`);
    } else {
      console.log(`  ✓ ${slug}: już niepublikowane`);
    }
  }

  const radek = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: "radek" } },
    limit: 1,
    overrideAccess: true,
  });
  if (!radek.docs.length) {
    console.error('Brak portfolio "radek"');
    process.exit(1);
  }
  const blocks = await payload.find({
    collection: "blocks",
    where: { and: [{ portfolio: { equals: radek.docs[0].id } }, { type: { equals: "projects" } }] },
    limit: 1,
    overrideAccess: true,
  });
  if (!blocks.docs.length) {
    console.log("  - radek: brak bloku projects, pomijam");
  } else {
    const blockId = blocks.docs[0].id;
    for (const locale of ["pl", "en"] as const) {
      const doc = (await payload.findByID({
        collection: "blocks",
        id: blockId,
        locale,
        depth: 0,
        overrideAccess: true,
      })) as unknown as { projectsData?: { items?: Record<string, unknown>[] } };
      const items = doc.projectsData?.items ?? [];
      let changed = 0;
      const next = items.map((item) => {
        const fields = ["title", "description"] as const;
        const out = { ...item };
        for (const f of fields) {
          const v = item[f];
          if (typeof v === "string" && THIRD_PARTY.test(v)) {
            out[f] = scrubSentences(v);
            changed++;
          }
        }
        return out;
      });
      if (changed > 0) {
        // zachowujemy `id` wierszy — inaczej update jednej lokalizacji kasuje drugą
        await payload.update({
          collection: "blocks",
          id: blockId,
          locale,
          data: { projectsData: { items: next } },
          overrideAccess: true,
        });
        console.log(`  ✓ radek/projects [${locale}]: oczyszczono ${changed} pól`);
      } else {
        console.log(`  ✓ radek/projects [${locale}]: brak wzmianek`);
      }
    }
  }

  // weryfikacja końcowa
  const leftovers: string[] = [];
  for (const locale of ["pl", "en"] as const) {
    const all = await payload.find({
      collection: "blocks",
      where: { portfolio: { equals: radek.docs[0].id } },
      locale,
      depth: 0,
      limit: 100,
      overrideAccess: true,
    });
    if (THIRD_PARTY.test(JSON.stringify(all.docs))) leftovers.push(locale);
  }
  if (leftovers.length) {
    console.error(`✗ W portfolio radek nadal są wzmianki osób trzecich (${leftovers.join(", ")})`);
    process.exit(1);
  }
  console.log("✓ Gotowe — brak danych osób trzecich w portfolio radek");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
