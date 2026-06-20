/**
 * Seed script — tworzy portfolio "radek" z MVP blokami przez Payload Local API.
 * Uruchom: npx tsx scripts/seed-radek.ts
 */
import { getPayload } from "payload";
import configPromise from "../payload.config";

async function seed() {
  const payload = await getPayload({ config: configPromise });

  // 1. Znajdź superadmina
  const users = await payload.find({
    collection: "users",
    where: { role: { equals: "superadmin" } },
    limit: 1,
    overrideAccess: true,
  });

  if (!users.docs.length) {
    console.error("Brak superadmina w bazie — uruchom najpierw /admin i utwórz konto.");
    process.exit(1);
  }

  const ownerId = users.docs[0].id;
  console.log(`Owner: ${users.docs[0].email} (id: ${ownerId})`);

  // 2. Sprawdź czy portfolio "radek" już istnieje
  const existing = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: "radek" } },
    limit: 1,
    overrideAccess: true,
  });

  let portfolioId: string | number;

  if (existing.docs.length) {
    portfolioId = existing.docs[0].id;
    console.log(`Portfolio "radek" już istnieje (id: ${portfolioId}) — pomijam tworzenie.`);
  } else {
    const portfolio = await payload.create({
      collection: "portfolios",
      data: {
        subdomain: "radek",
        owner: ownerId,
        type: "cv",
        theme: "light",
        colorScheme: "light",
        language: "pl-en",
        isPublished: true,
        contactEmail: "radoslaw.stawiszynski@gmail.com",
        seoTitle: "Radosław Stawiszyński — Portfolio",
        seoDescription: "Product Manager & IT Specialist z doświadczeniem w zarządzaniu projektami i rozwiązaniach technologicznych.",
      },
      overrideAccess: true,
    });

    portfolioId = portfolio.id;
    console.log(`Utworzono portfolio "radek" (id: ${portfolioId})`);
  }

  // 3. Bloki — hero i about
  const BLOCKS = [
    {
      type: "hero" as const,
      order: 1,
      data: {
        pl: {
          title: "Radosław Stawiszyński",
          subtitle: "Product Manager & IT Specialist",
          description: "Specjalizuję się w zarządzaniu projektami technologicznymi, tworzeniu produktów cyfrowych i budowaniu efektywnych zespołów.",
          ctaLabel: "Skontaktuj się",
          ctaHref: "#contact",
        },
        en: {
          title: "Radosław Stawiszyński",
          subtitle: "Product Manager & IT Specialist",
          description: "Specializing in technology project management, digital product development, and building high-performing teams.",
          ctaLabel: "Get in touch",
          ctaHref: "#contact",
        },
      },
    },
    {
      type: "about" as const,
      order: 2,
      data: {
        pl: {
          heading: "O mnie",
          bio: "Product Manager z pasją do technologii i nowych rozwiązań. Łączę umiejętności techniczne z biznesowym myśleniem, by tworzyć produkty, które naprawdę rozwiązują problemy użytkowników.",
          highlights: ["Next.js / TypeScript", "Payload CMS", "Zarządzanie projektami", "AI & Automation"],
        },
        en: {
          heading: "About me",
          bio: "Product Manager passionate about technology and innovation. I bridge technical and business thinking to build products that genuinely solve user problems.",
          highlights: ["Next.js / TypeScript", "Payload CMS", "Project Management", "AI & Automation"],
        },
      },
    },
    {
      type: "skills" as const,
      order: 3,
      data: {
        pl: {
          heading: "Umiejętności",
          categories: [
            {
              name: "Frontend",
              skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "React"],
            },
            {
              name: "Backend & CMS",
              skills: ["Payload CMS", "PostgreSQL", "Redis", "Node.js"],
            },
            {
              name: "Zarządzanie",
              skills: ["Agile / Scrum", "Product Roadmap", "Jira", "GitHub"],
            },
          ],
        },
        en: {
          heading: "Skills",
          categories: [
            {
              name: "Frontend",
              skills: ["Next.js 15", "TypeScript", "Tailwind CSS", "React"],
            },
            {
              name: "Backend & CMS",
              skills: ["Payload CMS", "PostgreSQL", "Redis", "Node.js"],
            },
            {
              name: "Management",
              skills: ["Agile / Scrum", "Product Roadmap", "Jira", "GitHub"],
            },
          ],
        },
      },
    },
    {
      type: "contact" as const,
      order: 4,
      data: {
        pl: {
          heading: "Kontakt",
          email: "radoslaw.stawiszynski@gmail.com",
          linkedin: "https://linkedin.com/in/radoslawstawiszynski",
          github: "https://github.com/RadoslawStawiszynski",
          formLabel: "Wyślij wiadomość",
        },
        en: {
          heading: "Contact",
          email: "radoslaw.stawiszynski@gmail.com",
          linkedin: "https://linkedin.com/in/radoslawstawiszynski",
          github: "https://github.com/RadoslawStawiszynski",
          formLabel: "Send a message",
        },
      },
    },
  ];

  // Sprawdź istniejące bloki
  const existingBlocks = await payload.find({
    collection: "blocks",
    where: { portfolio: { equals: portfolioId } },
    limit: 20,
    overrideAccess: true,
  });

  if (existingBlocks.docs.length > 0) {
    console.log(`Portfolio ma już ${existingBlocks.docs.length} bloków — pomijam tworzenie bloków.`);
  } else {
    for (const block of BLOCKS) {
      await payload.create({
        collection: "blocks",
        data: {
          portfolio: portfolioId,
          type: block.type,
          order: block.order,
          visible: true,
          data: block.data,
        },
        overrideAccess: true,
      });
      console.log(`  ✓ Blok "${block.type}" (order: ${block.order})`);
    }
    console.log(`Utworzono ${BLOCKS.length} bloków.`);
  }

  console.log("\n✅ Seed zakończony. Otwórz: http://localhost:3000/dev/radek");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
