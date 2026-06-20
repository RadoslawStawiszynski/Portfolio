/**
 * Seed script — tworzy portfolio "radek" z MVP blokami przez Payload Local API.
 *
 * Uruchom: npx tsx scripts/seed-radek.ts
 *
 * Wymaga: superadmin w bazie (stwórz konto na /admin najpierw).
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

// loadEnvConfig musi być przed importem payload.config (dynamiczny import niżej)
loadEnvConfig(path.resolve(__dirname, ".."));

async function seed() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  // 1. Znajdź superadmina
  const users = await payload.find({
    collection: "users",
    where: { role: { equals: "superadmin" } },
    limit: 1,
    overrideAccess: true,
  });

  if (!users.docs.length) {
    console.error("Brak superadmina w bazie — wejdź na /admin i utwórz konto.");
    process.exit(1);
  }

  const ownerId = users.docs[0].id;
  console.log(`✓ Owner: ${users.docs[0].email} (id: ${ownerId})`);

  // 2. Utwórz lub znajdź portfolio "radek"
  const existing = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: "radek" } },
    limit: 1,
    overrideAccess: true,
  });

  let portfolioId: string | number;

  if (existing.docs.length) {
    portfolioId = existing.docs[0].id;
    console.log(`✓ Portfolio "radek" już istnieje (id: ${portfolioId})`);
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
        seoDescription:
          "Product Manager & IT Specialist z doświadczeniem w zarządzaniu projektami i rozwiązaniach technologicznych.",
      },
      overrideAccess: true,
    });
    portfolioId = portfolio.id;
    console.log(`✓ Utworzono portfolio "radek" (id: ${portfolioId})`);
  }

  // 3. Sprawdź istniejące bloki
  const existingBlocks = await payload.find({
    collection: "blocks",
    where: { portfolio: { equals: portfolioId } },
    limit: 20,
    overrideAccess: true,
  });

  if (existingBlocks.docs.length > 0) {
    console.log(
      `✓ Portfolio ma już ${existingBlocks.docs.length} bloków — pomijam tworzenie bloków.`
    );
    console.log("\n✅ Seed zakończony.");
    process.exit(0);
  }

  // 4. Hero — PL (create) + EN (update)
  console.log("\nTworzę bloki...");

  const hero = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "hero",
      order: 10,
      visible: true,
      heroData: {
        title: "Radosław Stawiszyński",
        subtitle: "Product Manager & IT Specialist",
        ctaLabel: "Skontaktuj się",
        ctaHref: "#contact",
        avatarUrl: "/images/radek-photo.jpg",
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
        title: "Radosław Stawiszyński",
        subtitle: "Product Manager & IT Specialist",
        ctaLabel: "Get in touch",
        ctaHref: "#contact",
        avatarUrl: "/images/radek-photo.jpg",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ hero (order: 10)");

  // 5. About
  const about = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "about",
      order: 20,
      visible: true,
      aboutData: {
        bio: "Product Manager z pasją do technologii i nowych rozwiązań. Łączę umiejętności techniczne z biznesowym myśleniem, by tworzyć produkty, które naprawdę rozwiązują problemy użytkowników. Doświadczenie w zarządzaniu projektami IT, budowaniu zespołów i wdrażaniu rozwiązań cyfrowych.",
        photoUrl: "/images/radek-photo.jpg",
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
        bio: "Product Manager passionate about technology and innovation. I bridge technical expertise with business thinking to build products that genuinely solve user problems. Experienced in IT project management, team building, and digital transformation.",
        photoUrl: "/images/radek-photo.jpg",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ about (order: 20)");

  // 6. Experience
  const experience = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "experience",
      order: 30,
      visible: true,
      experienceData: {
        items: [
          {
            company: "PortfolioHub",
            role: "Product Manager & Lead Developer",
            startDate: "2026-05",
            description:
              "Projektowanie i budowa wielodostępnej platformy portfolio. Stack: Next.js 15, Payload CMS 3, PostgreSQL, Vercel.",
          },
          {
            company: "CBM",
            role: "IT Specialist",
            startDate: "2020-01",
            description:
              "Zarządzanie infrastrukturą IT, wdrożenia systemów, wsparcie techniczne.",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  await payload.update({
    collection: "blocks",
    id: experience.id,
    locale: "en",
    data: {
      experienceData: {
        items: [
          {
            company: "PortfolioHub",
            role: "Product Manager & Lead Developer",
            startDate: "2026-05",
            description:
              "Designing and building a multi-tenant portfolio platform. Stack: Next.js 15, Payload CMS 3, PostgreSQL, Vercel.",
          },
          {
            company: "CBM",
            role: "IT Specialist",
            startDate: "2020-01",
            description:
              "IT infrastructure management, system deployments, technical support.",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ experience (order: 30)");

  // 7. Skills
  const skills = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "skills",
      order: 40,
      visible: true,
      skillsData: {
        categories: [
          {
            name: "Frontend",
            skills: "Next.js 15\nTypeScript\nTailwind CSS\nReact\nFramer Motion",
          },
          {
            name: "Backend & CMS",
            skills: "Payload CMS\nPostgreSQL\nRedis\nNode.js\nREST API",
          },
          {
            name: "Zarządzanie projektami",
            skills: "Agile / Scrum\nProduct Roadmap\nJira\nGitHub\nCI/CD",
          },
          {
            name: "Narzędzia & AI",
            skills: "Claude Code\nOllama / Qwen\nDocker\nVercel\nCloudflare",
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
            name: "Frontend",
            skills: "Next.js 15\nTypeScript\nTailwind CSS\nReact\nFramer Motion",
          },
          {
            name: "Backend & CMS",
            skills: "Payload CMS\nPostgreSQL\nRedis\nNode.js\nREST API",
          },
          {
            name: "Project Management",
            skills: "Agile / Scrum\nProduct Roadmap\nJira\nGitHub\nCI/CD",
          },
          {
            name: "Tools & AI",
            skills: "Claude Code\nOllama / Qwen\nDocker\nVercel\nCloudflare",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ skills (order: 40)");

  // 8. Education
  const education = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "education",
      order: 50,
      visible: true,
      educationData: {
        items: [
          {
            school: "— uzupełnij w /admin —",
            degree: "—",
            field: "—",
            startYear: 2020,
          },
        ],
      },
    },
    overrideAccess: true,
  });
  await payload.update({
    collection: "blocks",
    id: education.id,
    locale: "en",
    data: {
      educationData: {
        items: [
          {
            school: "— fill in /admin —",
            degree: "—",
            field: "—",
            startYear: 2020,
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ education (order: 50) — uzupełnij dane w /admin");

  // 9. Contact
  await payload.create({
    collection: "blocks",
    data: {
      portfolio: portfolioId,
      type: "contact",
      order: 60,
      visible: true,
      contactData: {
        email: "radoslaw.stawiszynski@gmail.com",
        linkedin: "https://linkedin.com/in/radoslawstawiszynski",
        github: "https://github.com/RadoslawStawiszynski",
        showForm: true,
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ contact (order: 60)");

  console.log("\n✅ Seed zakończony — 6 bloków utworzonych.");
  console.log("   Lokalnie:   http://localhost:3000/dev/radek");
  console.log("   Produkcja:  https://radek.korp-cbm.com");
  console.log("   Edycja:     /admin → Blocks");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
