/**
 * Seed script — tworzy portfolio "milosz" z blokami przez Payload Local API.
 * Uruchom: npx tsx scripts/seed-milosz.ts
 * Neon:    DATABASE_URL="postgresql://..." npx tsx scripts/seed-milosz.ts
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
    where: { subdomain: { equals: "milosz" } },
    limit: 1,
    overrideAccess: true,
  });

  let portfolioId: string | number;

  if (existing.docs.length) {
    portfolioId = existing.docs[0].id;
    console.log(`✓ Portfolio "milosz" już istnieje (id: ${portfolioId})`);
  } else {
    const portfolio = await payload.create({
      collection: "portfolios",
      data: {
        subdomain: "milosz",
        owner: ownerId,
        type: "cv",
        theme: "light",
        colorScheme: "light",
        language: "pl-en",
        isPublished: true,
        contactEmail: "milosz.a.gawlik@gmail.com",
        seoTitle: "Miłosz Gawlik — Portfolio",
        seoDescription:
          "IT Professional · Software Tester · Infrastructure Engineer — ponad 4 lata doświadczenia w środowiskach Linux, Windows Server i testowaniu oprogramowania.",
      },
      overrideAccess: true,
    });
    portfolioId = portfolio.id;
    console.log(`✓ Utworzono portfolio "milosz" (id: ${portfolioId})`);
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
        title: "Miłosz Gawlik",
        subtitle: "Specjalista IT · Tester Oprogramowania · Inżynier Infrastruktury",
        ctaLabel: "Skontaktuj się",
        ctaHref: "#contact",
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
        title: "Miłosz Gawlik",
        subtitle: "IT Professional · Software Tester · Infrastructure Engineer",
        ctaLabel: "Get in touch",
        ctaHref: "#contact",
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
        bio: "Jestem specjalistą IT z ponad 4-letnim doświadczeniem w pracy na stanowiskach technicznych związanych z obsługą komputerów i zarządzaniem infrastrukturą IT. Łączę precyzję z wysokimi umiejętnościami interpersonalnymi — cechuje mnie łatwość nawiązywania relacji i organizacji pracy grupowej. Posiadam znajomość języka angielskiego na poziomie B2. Jestem człowiekiem ambitnym, lubiącym ciągły samorozwój i kreatywność. Dyspozycyjny i mobilny (prawo jazdy kat. B).",
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
        bio: "A detail-oriented IT professional with experience in software testing and IT systems monitoring. I combine precision and consistency with strong interpersonal skills and the ability to organize effective teamwork. I am passionate about ensuring system reliability and delivering high quality results. English B2+, eager to continuously develop skills and learn new technologies.",
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ about (order: 20)");

  // Experience
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
            company: "Digital Warehouse – Paweł Synowiec",
            role: "Tester Oprogramowania",
            startDate: "2025-09",
            endDate: "2025-12",
            description:
              "Ręczne testowanie aplikacji webowych, identyfikacja defektów i weryfikacja poprawek. Testy API przy użyciu Insomnia GraphQL. Dokumentowanie zgłoszeń w Obsidian, współpraca z zespołem deweloperskim.",
          },
          {
            company: "Teleperformance Poland",
            role: "Specjalista Wsparcia Technicznego",
            startDate: "2025-01",
            endDate: "2025-04",
            description:
              "Obsługa zgłoszeń klientów (email, chat, telefon) dotyczących problemów technicznych z urządzeniami. Zarządzanie zadaniami administracyjnymi, aktualizacja danych klientów, współpraca z zespołami wewnętrznymi i zewnętrznymi.",
          },
          {
            company: "Capgemini Poland",
            role: "Młodszy Inżynier Infrastruktury IT",
            startDate: "2021-07",
            endDate: "2024-06",
            description:
              "Zarządzanie środowiskami Linux i Windows Server, zapewnienie wysokiej dostępności. Kontrola wersji i skryptowanie Bash. Wsparcie infrastruktury IT: wirtualizacja VMware vSphere. Utrzymanie dokumentacji technicznej w Confluence.",
          },
          {
            company: "Capgemini Poland",
            role: "Analityk Monitoringu IT",
            startDate: "2019-12",
            endDate: "2021-07",
            description:
              "Monitoring infrastruktury IT przy użyciu Zabbix, SCOM i DX Spectrum. Zarządzanie incydentami, problemami i zmianami w ServiceNow i Jira. Wsparcie środowisk Microsoft 365 i Google Workspace. Nagroda Thank You Award za rozwiązanie krytycznego incydentu.",
          },
          {
            company: "Millennium Leasing",
            role: "Specjalista ds. Sprzedaży",
            startDate: "2013-06",
            endDate: "2015-06",
            description:
              "Obsługa klientów w zakresie produktów leasingowych. 2-letnie doświadczenie w administracji biurowej i prowadzeniu dokumentacji.",
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
            company: "Digital Warehouse – Paweł Synowiec",
            role: "Software Tester",
            startDate: "2025-09",
            endDate: "2025-12",
            description:
              "Performed manual testing of web applications, identifying defects and verifying fixes. Used Obsidian for test documentation. API testing using Insomnia GraphQL. Collaborated with development teams to ensure quality deliverables.",
          },
          {
            company: "Teleperformance Poland",
            role: "Technical Support Specialist",
            startDate: "2025-01",
            endDate: "2025-04",
            description:
              "Handled customer inquiries via email, chat and calls about technical issues with devices. Managed administrative tasks and updated customer details. Collaborated with internal and external teams.",
          },
          {
            company: "Capgemini Poland",
            role: "Junior Infrastructure Engineer",
            startDate: "2021-07",
            endDate: "2024-06",
            description:
              "Managed and maintained Linux and Windows Server environments, ensuring high availability. Version control and Bash scripting. IT infrastructure support including virtualisation with VMware vSphere. Maintained technical documentation in Confluence.",
          },
          {
            company: "Capgemini Poland",
            role: "IT Monitoring Analyst",
            startDate: "2019-12",
            endDate: "2021-07",
            description:
              "Monitored IT infrastructure using Zabbix, SCOM and DX Spectrum. Managed incidents and changes in ServiceNow and Jira. Supported Microsoft 365 and Google Workspace. Thank You Award recipient.",
          },
          {
            company: "Millennium Leasing",
            role: "Sales Specialist",
            startDate: "2013-06",
            endDate: "2015-06",
            description:
              "Customer service for leasing products. 2 years of experience in office administration and documentation management.",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ experience (order: 30) — 5 pozycji");

  // Skills
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
            name: "Systemy i infrastruktura",
            skills: "Windows / Linux\nVMware vSphere\nMicrosoft 365\nGoogle Workspace",
          },
          {
            name: "Monitoring i ITSM",
            skills: "Zabbix\nSCOM\nDX Spectrum\nServiceNow\nControl-M\nITSM",
          },
          {
            name: "Testowanie i narzędzia",
            skills: "Insomnia GraphQL\nJira\nConfluence\nObsidian\nGit\nBash scripting",
          },
          {
            name: "Inne",
            skills: "Microsoft Dynamics 365\nAngielski B2+",
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
            name: "Systems & Infrastructure",
            skills: "Windows / Linux\nVMware vSphere\nMicrosoft 365\nGoogle Workspace",
          },
          {
            name: "Monitoring & ITSM",
            skills: "Zabbix\nSCOM\nDX Spectrum\nServiceNow\nControl-M\nITSM",
          },
          {
            name: "Testing & Tools",
            skills: "Insomnia GraphQL\nJira\nConfluence\nObsidian\nGit\nBash scripting",
          },
          {
            name: "Other",
            skills: "Microsoft Dynamics 365\nEnglish B2+",
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ skills (order: 40) — 4 kategorie");

  // Education
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
            school: "Liceum Ogólnokształcące nr 3 w Tychach",
            degree: "Matura",
            field: "Profil językowo-humanistyczny",
            startYear: 2007,
            endYear: 2011,
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
            school: "General Secondary School No. 3 in Tychy",
            degree: "High School Diploma",
            field: "Language profile",
            startYear: 2007,
            endYear: 2011,
          },
        ],
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ education (order: 50)");

  // Contact
  await payload.create({
    collection: "blocks",
    data: {
      portfolio: portfolioId,
      type: "contact",
      order: 60,
      visible: true,
      contactData: {
        email: "milosz.a.gawlik@gmail.com",
        phone: "+48 885 577 005",
        linkedin: "https://www.linkedin.com/in/gawlikmilosz",
        showForm: true,
      },
    },
    overrideAccess: true,
  });
  console.log("  ✓ contact (order: 60)");

  console.log("\n✅ Seed zakończony — 6 bloków utworzonych.");
  console.log("   Lokalnie:   http://localhost:3000/dev/milosz");
  console.log("   Produkcja:  https://milosz.korp-cbm.com");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
