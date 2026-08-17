/**
 * Seed script — tworzy portfolio "radek" z blokami przez Payload Local API.
 * Dane: CV Radosława Stawiszyńskiego (21.06.2024)
 *
 * Uruchom: npx tsx scripts/seed-radek.ts
 * Neon:    DATABASE_URL="postgresql://..." npx tsx scripts/seed-radek.ts
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
    console.error("Brak superadmina w bazie — wejdź na /admin i utwórz konto.");
    process.exit(1);
  }

  const ownerId = users.docs[0].id;
  console.log(`✓ Owner: ${users.docs[0].email} (id: ${ownerId})`);

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
          "Project Manager i specjalista IT z doświadczeniem w zarządzaniu projektami, infrastrukturą i rozwiązaniach cyfrowych.",
      },
      overrideAccess: true,
    });
    portfolioId = portfolio.id;
    console.log(`✓ Utworzono portfolio "radek" (id: ${portfolioId})`);
  }

  const existingBlocks = await payload.find({
    collection: "blocks",
    where: { portfolio: { equals: portfolioId } },
    limit: 1,
    overrideAccess: true,
  });

  if (existingBlocks.docs.length > 0) {
    console.log("✓ Bloki już istnieją — pomijam. Usuń je w /admin lub przez DB żeby re-seedować.");
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
        title: "Radosław Stawiszyński",
        subtitle: "Project Manager · Specjalista IT · Twórca PortfolioHub",
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
        subtitle: "Project Manager · IT Specialist · PortfolioHub Creator",
        ctaLabel: "Get in touch",
        ctaHref: "#contact",
        avatarUrl: "/images/radek-photo.jpg",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ hero (order: 10)");

  // About — pełny tekst z CV Summary
  const about = await payload.create({
    collection: "blocks",
    locale: "pl",
    data: {
      portfolio: portfolioId,
      type: "about",
      order: 20,
      visible: true,
      aboutData: {
        bio: "Jestem dynamicznym i zdeterminowanym project managerem, gotowym na nowe wyzwania i rozwój w branży technologicznej. Posiadam rozległą wiedzę techniczną, w tym umiejętności programistyczne, które pozwalają mi skutecznie weryfikować i wspierać projekty IT.\n\nŁączę kompetencje techniczne z myśleniem biznesowym — zarządzam projektami cyfrowymi, buduję zespoły i wdrażam rozwiązania, które realnie rozwiązują problemy użytkowników. Preferuję pracę stacjonarną z możliwością wyjazdów służbowych.\n\nTwórca platformy PortfolioHub — wielodostępnego systemu portfolio budowanego w oparciu o Next.js 15, Payload CMS i PostgreSQL.",
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
        bio: "I am a dynamic and determined project manager, ready for new challenges and growth in the technology industry. I possess extensive technical knowledge, including proficiency in programming languages, which enables me to effectively verify and support IT projects.\n\nI bridge technical expertise with business thinking — managing digital projects, building teams and implementing solutions that genuinely solve user problems. I prefer an office-based role with occasional business trips.\n\nCreator of PortfolioHub — a multi-tenant portfolio platform built with Next.js 15, Payload CMS and PostgreSQL.",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ about (order: 20)");

  // Experience — 5 pozycji z CV
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
            company: "PortfolioHub (własny projekt)",
            role: "Product Manager & Lead Developer",
            startDate: "2024-10",
            description:
              "Projektowanie i budowa wielodostępnej platformy portfolio. Stack: Next.js 15, Payload CMS 3, PostgreSQL, Redis, Cloudflare R2, Vercel. Architektura multi-tenant z subdomenami, panel admina, system bloków edytowalnych.",
          },
          {
            company: "CBM Radosław Stawiszyński (własna działalność B2B)",
            role: "Kierownik Projektu / Specjalista IT",
            startDate: "2021-03",
            description:
              "Prowadzenie biura projektowego instalacji fotowoltaicznych, pomp ciepła i systemów smart home (Grenton). Zarządzanie działem logistyki, magazynem, działem zaopatrzenia i zespołami montażowymi.",
          },
          {
            company: "Expertel Serwis – Katowice",
            role: "Koordynator Techniczny",
            startDate: "2019-10",
            endDate: "2020-09",
            description:
              "Koordynowanie pracy zespołów telekomunikacyjnych i fotowoltaicznych. Nadzór postępu prac, sporządzanie dokumentacji i raportowanie. Koordynacja pracy magazynu, zamawianie towarów. Współpraca z inwestorami i dostawcami.",
          },
          {
            company: "Optical Core / Qi Connect",
            role: "Technik Telekomunikacyjny / Koordynator",
            startDate: "2018-04",
            endDate: "2019-08",
            description:
              "Koordynowanie pracy zespołu. Nadzór i organizacja postępu prac, rozliczenia z firmami zewnętrznymi, zatrudnianie pracowników. Koordynacja zaopatrzenia materiałowego. Współpraca z jednostkami administracyjnymi.",
          },
          {
            company: "Creative Ceramika Sp. z o.o.",
            role: "Projektant (graficzny i procesowy)",
            startDate: "2016-07",
            endDate: "2018-01",
            description:
              "Wdrażanie nowych projektów i koordynacja linii produkcyjnej drukarki cyfrowej (zespół 4-5 osób). Tworzenie technologii produkcji kafli ceramicznych z użyciem grawera laserowego. Współpraca z zespołem technicznym we Włoszech (w j. angielskim). Koordynacja budowy sklepu internetowego.",
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
            company: "PortfolioHub (own project)",
            role: "Product Manager & Lead Developer",
            startDate: "2024-10",
            description:
              "Designing and building a multi-tenant portfolio platform. Stack: Next.js 15, Payload CMS 3, PostgreSQL, Redis, Cloudflare R2, Vercel. Multi-tenant architecture with subdomains, admin panel, editable block system.",
          },
          {
            company: "CBM Radosław Stawiszyński (own business B2B)",
            role: "Project Manager / IT Specialist",
            startDate: "2021-03",
            description:
              "Leading the design office for photovoltaic installations, heat pumps and smart home systems (Grenton). Managing the logistics department, warehouse, procurement and assembly teams.",
          },
          {
            company: "Expertel Serwis – Katowice",
            role: "Technical Coordinator",
            startDate: "2019-10",
            endDate: "2020-09",
            description:
              "Coordinating telecommunications and photovoltaic teams. Supervising work progress, preparing documentation and reporting. Running the warehouse, ordering goods. Cooperating with investors and suppliers.",
          },
          {
            company: "Optical Core / Qi Connect",
            role: "Telecommunication Technician / Coordinator",
            startDate: "2018-04",
            endDate: "2019-08",
            description:
              "Coordinating a team, supervising work progress, settlements with external companies, hiring employees. Coordinating material procurement. Cooperating with administrative units.",
          },
          {
            company: "Creative Ceramika Sp. z o.o.",
            role: "Designer (graphic and process)",
            startDate: "2016-07",
            endDate: "2018-01",
            description:
              "Implementing new projects and coordinating the digital printer production line (team of 4-5 people). Creating ceramic tile production technology using a laser engraver. Cooperation with the technical team in Italy (in English). Coordinating the building of an online store.",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ experience (order: 30) — 5 pozycji");

  // Skills — wszystkie kategorie z CV + PortfolioHub stack
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
            name: "Programowanie",
            skills: "Python (podstawy)\nC++ (podstawy)\nSQL (podstawy)\nHTML / CSS (podstawy)\nReact / JS (w trakcie nauki)\nPascal (podstawy)",
          },
          {
            name: "Technologie webowe",
            skills: "Next.js 15\nTypeScript\nTailwind CSS\nPayload CMS\nPostgreSQL\nRedis\nNode.js",
          },
          {
            name: "Narzędzia deweloperskie",
            skills: "PyCharm\nVS Code\nGit / GitHub\nDocker\nVercel\nCloudflare\nClaude Code / AI",
          },
          {
            name: "Zarządzanie projektami",
            skills: "Agile / Scrum\nProduct Roadmap\nBPMN\nJira\nDokumentacja techniczna",
          },
          {
            name: "Technika i certyfikaty",
            skills: "Linux (Ubuntu podstawy)\nMicrosoft Excel / Word (zaawansowany)\nPV Sol / PV Sys (zaawansowany)\nCertyfikat SEP D1, E1\nPrawo jazdy kat. B\nSchematy elektryczne i telekomunikacyjne",
          },
          {
            name: "Umiejętności miękkie i języki",
            skills: "Zarządzanie zespołem\nOrganizacja pracy\nSumienność i odpowiedzialność\nJęzyk angielski – B2\nJęzyk niemiecki – A1\nJęzyk polski – ojczysty",
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
            name: "Programming",
            skills: "Python (basic)\nC++ (basic)\nSQL (entry level)\nHTML / CSS (basic)\nReact / JS (studying)\nPascal (basic)",
          },
          {
            name: "Web Technologies",
            skills: "Next.js 15\nTypeScript\nTailwind CSS\nPayload CMS\nPostgreSQL\nRedis\nNode.js",
          },
          {
            name: "Dev Tools",
            skills: "PyCharm\nVS Code\nGit / GitHub\nDocker\nVercel\nCloudflare\nClaude Code / AI",
          },
          {
            name: "Project Management",
            skills: "Agile / Scrum\nProduct Roadmap\nBPMN\nJira\nTechnical Documentation",
          },
          {
            name: "Technical & Certifications",
            skills: "Linux (Ubuntu basic)\nMicrosoft Excel / Word (advanced)\nPV Sol / PV Sys (advanced)\nSEP D1, E1 certification\nCategory B Driving Licence\nElectrical & telecom schematics",
          },
          {
            name: "Soft Skills & Languages",
            skills: "Team management\nWork organisation\nScrupulousness & responsibility\nEnglish – B2\nGerman – A1\nPolish – native",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ skills (order: 40) — 6 kategorii");

  // Education — 3 wpisy z CV
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
            school: "Akademia Humanistyczno-Ekonomiczna w Łodzi",
            degree: "Studia inżynierskie (w trakcie)",
            field: "Informatyka",
            startYear: 2023,
          },
          {
            school: "Politechnika Gdańska",
            degree: "Studia (przerwane)",
            field: "Chemia ogólna",
            startYear: 2012,
            endYear: 2013,
          },
          {
            school: "I LO im. Marii Curie-Skłodowskiej w Tczewie",
            degree: "Matura",
            field: "Profil matematyczno-przyrodniczy",
            startYear: 2008,
            endYear: 2012,
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
            school: "Academy of Humanities and Economics in Łódź",
            degree: "Engineering studies (in progress)",
            field: "Computer Science",
            startYear: 2023,
          },
          {
            school: "Gdańsk University of Technology",
            degree: "Studies (discontinued)",
            field: "General Chemistry",
            startYear: 2012,
            endYear: 2013,
          },
          {
            school: "I High School im. Marii Curie-Skłodowskiej in Tczew",
            degree: "High School Diploma",
            field: "Mathematics and science profile",
            startYear: 2008,
            endYear: 2012,
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ education (order: 50) — 3 wpisy");

  // Contact
  await payload.create({
    collection: "blocks",
    data: {
      portfolio: portfolioId,
      type: "contact",
      order: 60,
      visible: true,
      contactData: {
        phone: "+48 789 273 573",
        linkedin: "https://linkedin.com/in/radoslawstawiszynski",
        github: "https://github.com/RadoslawStawiszynski",
        showForm: true,
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ contact (order: 60)");

  console.log("\n✅ Seed zakończony — 6 bloków.");
  console.log("   Lokalnie:   http://localhost:3000/dev/radek");
  console.log("   Produkcja:  https://radek.korp-cbm.com");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
