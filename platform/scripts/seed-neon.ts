/**
 * Pełny seed na bazę Neon (produkcja).
 * Uruchom z DATABASE_URL wskazującym na Neon:
 *
 *   DATABASE_URL="postgresql://..." npx tsx scripts/seed-neon.ts
 *
 * Co robi:
 *   1. Tworzy superadmina (biuro@korp-cbm.com)
 *   2. Portfolio + bloki: radek (7 bloków), milosz (6), martyna (4)
 *   3. Konta owner: milosz@portfoliohub.dev, martyna.stawiszynska@gmail.com
 *   4. CV PDF URLs (już wgrane do R2), motywy
 *
 * ⚠ Idempotentny — bezpieczne wielokrotne uruchamianie.
 * ⚠ Hasło superadmina: zmień po zalogowaniu na /admin → Users!
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

// ─── Dane seed ────────────────────────────────────────────────────────────────

const SUPERADMIN = {
  email: "biuro@korp-cbm.com",
  password: "PortfolioHub2024!",
};

const R2 = process.env.R2_ENDPOINT + "/" + process.env.R2_BUCKET_NAME;

const PORTFOLIOS = [
  {
    subdomain: "radek",
    theme: "retro-terminal" as const,
    type: "cv" as const,
    language: "pl" as const,
    cvPdfPl: `${R2}/radek/cv/cv-radek-pl.pdf`,
    cvPdfEn: `${R2}/radek/cv/cv-radek-en.pdf`,
    contactEmail: "radoslaw.stawiszynski@gmail.com",
    seoTitle: "Radosław Stawiszyński — PM & IT Portfolio",
    seoDescription: "Portfolio Radosława Stawiszyńskiego — Project Manager & IT Specialist.",
  },
  {
    subdomain: "milosz",
    theme: "light" as const,
    type: "cv" as const,
    language: "pl" as const,
    cvPdfPl: `${R2}/milosz/cv/cv-milosz-pl.pdf`,
    contactEmail: "milosz@portfoliohub.dev",
    seoTitle: "Miłosz Gawlik — IT Portfolio",
    seoDescription: "Portfolio Miłosza Gawlika — IT Specialist.",
  },
  {
    subdomain: "martyna",
    theme: "slate-rose" as const,
    type: "author" as const,
    language: "pl" as const,
    contactEmail: "martyna.stawiszynska@gmail.com",
    seoTitle: "Martyna Stawiszyńska — Autorka książek",
    seoDescription: "Portfolio Martyny Stawiszyńskiej — autorki książek Nancy Martin.",
  },
];

// ─── Bloki per portfolio (copy from local seed scripts) ──────────────────────

function getRadekBlocks(portfolioId: string | number) {
  return [
    { portfolio: portfolioId, type: "hero", order: 10, visible: true, heroData: {
        title: "Radosław Stawiszyński", subtitle: "Project Manager & IT Specialist",
        avatarUrl: "https://d15f91309fa108549e8be8edcbb00c98.r2.cloudflarestorage.com/portfoliohub/media/radek-photo.jpg",
        ctaLabel: "Pobierz CV", ctaHref: "/api/download-cv",
    }},
    { portfolio: portfolioId, type: "about", order: 20, visible: true, aboutData: {
        bio: `Specjalista IT z 10-letnim doświadczeniem w zarządzaniu projektami i systemami informatycznymi. Łączę wiedzę techniczną (PostgreSQL, Python, Next.js, Docker) z kompetencjami PM (Agile, Scrum, planowanie, raportowanie).

Aktualnie pracuję w CBM Sp. z o.o. jako Specjalista ds. IT i Zarządzania Projektem oraz w Grupie eSky jako Project Manager.

Pasjonuję się automatyzacją procesów, lokalnymi modelami AI (Ollama, Qwen) i budowaniem narzędzi developerskich.`,
    }},
    { portfolio: portfolioId, type: "experience", order: 30, visible: true, experienceData: { items: [
        { company: "Grupa eSky", role: "Project Manager", startDate: "2024-04", description: "Zarządzanie projektami IT w branży travel-tech. Koordynacja zespołów deweloperskich, planowanie sprintów, raportowanie statusów." },
        { company: "CBM Sp. z o.o.", role: "Specjalista ds. IT i Zarządzania Projektem", startDate: "2020-01", description: "Administracja systemami, wdrażanie oprogramowania, wsparcie techniczne, zarządzanie infrastrukturą IT." },
        { company: "Seohost.pl", role: "Specjalista ds. Wsparcia Technicznego", startDate: "2018-06", endDate: "2020-01", description: "Wsparcie techniczne klientów hostingowych, administracja serwerami, konfiguracja DNS i SSL." },
        { company: "Comarch SA", role: "Konsultant IT", startDate: "2016-03", endDate: "2018-05", description: "Wdrożenia systemów ERP, szkolenia użytkowników, wsparcie posprzedażowe." },
        { company: "T-Systems Polska", role: "Młodszy Specjalista IT", startDate: "2014-09", endDate: "2016-02", description: "Helpdesk L1/L2, obsługa zgłoszeń serwisowych, konfiguracja stacji roboczych." },
    ]}},
    { portfolio: portfolioId, type: "skills", order: 40, visible: true, skillsData: { categories: [
        { name: "Project Management", skills: "Agile / Scrum\nKanban\nPlanowanie projektów\nZarządzanie ryzykiem\nRaportowanie\nJira / Confluence" },
        { name: "Programowanie", skills: "Python\nTypeScript / JavaScript\nNext.js 15\nSQL (PostgreSQL)\nHTTP / REST API" },
        { name: "DevOps & Infra", skills: "Docker / Docker Compose\nGit / GitHub\nLinux (Ubuntu / Debian)\nVercel\nCloudflare" },
        { name: "CMS & Bazy danych", skills: "Payload CMS 3\nPostgreSQL 16\nRedis\nNeon\nPrisma ORM" },
        { name: "AI & Automatyzacja", skills: "Ollama (lokalny LLM)\nQwen3-Coder\nPython scripting\nProcess automation" },
        { name: "Biurowe & Komunikacja", skills: "MS Office 365\nMS Project\nGoogle Workspace\nSlack / Teams\nPL / EN (B2+)" },
    ]}},
    { portfolio: portfolioId, type: "education", order: 50, visible: true, educationData: { items: [
        { school: "Akademia Humanistyczno-Ekonomiczna w Łodzi", degree: "Inżynier", field: "Informatyka", startYear: 2023 },
        { school: "Politechnika Gdańska", degree: "Studia przerwane", field: "Chemia", startYear: 2012, endYear: 2013 },
        { school: "I Liceum Ogólnokształcące w Tczewie", degree: "Matura", field: "Profil matematyczno-informatyczny", startYear: 2008, endYear: 2012 },
    ]}},
    { portfolio: portfolioId, type: "projects", order: 55, visible: true, projectsData: { items: [
        { title: "PortfolioHub", description: "Wielodostępna platforma portfolio — Next.js 15, Payload CMS 3, PostgreSQL, subdomain routing.", tags: "Next.js, TypeScript, Payload CMS, PostgreSQL, Tailwind CSS, Cloudflare R2, Vercel", githubUrl: "https://github.com/RadoslawStawiszynski/Portfolio", status: "in-progress" },
        { title: "Lokalny Asystent AI", description: "Eksperyment z lokalnym LLM — custom Modelfile Qwen3-Coder-30B z polskim promptem systemowym.", tags: "Python, Ollama, Qwen3, LLM, AI", status: "completed" },
        { title: "DB Connector", description: "Desktopowa aplikacja Python/Tkinter do łączenia z PostgreSQL, MSSQL i IBM DB2. Szyfrowanie Fernet, PyInstaller packaging.", tags: "Python, Tkinter, PostgreSQL, MSSQL, IBM DB2, Fernet, PyInstaller", status: "completed" },
        { title: "Nancy Card v1", description: "Prototyp portfolio dla autorki książek — Next.js, Supabase Auth, panel admin, CRUD postów.", tags: "Next.js, Supabase, TypeScript, React", status: "archived" },
    ]}},
    { portfolio: portfolioId, type: "contact", order: 60, visible: true, contactData: {
        linkedin: "https://www.linkedin.com/in/radoslaw-stawiszynski/",
        github: "https://github.com/RadoslawStawiszynski",
        showForm: true,
    }},
  ];
}

function getMiloszBlocks(portfolioId: string | number) {
  return [
    { portfolio: portfolioId, type: "hero", order: 10, visible: true, heroData: {
        title: "Miłosz Gawlik", subtitle: "IT Specialist & Developer",
        ctaLabel: "Pobierz CV", ctaHref: "/api/download-cv",
    }},
    { portfolio: portfolioId, type: "about", order: 20, visible: true, aboutData: {
        bio: "Specjalista IT z doświadczeniem w branży finansowej i technologicznej. Pasjonat nowych technologii, programowania i automatyzacji procesów.",
    }},
    { portfolio: portfolioId, type: "experience", order: 30, visible: true, experienceData: { items: [
        { company: "Capgemini", role: "IT Specialist", startDate: "2022-03", description: "Wsparcie systemów IT dla klientów enterprise, administracja infrastrukturą, zarządzanie incydentami." },
        { company: "Teleperformance", role: "Technical Support Specialist", startDate: "2020-06", endDate: "2022-02", description: "Wsparcie techniczne klientów B2C i B2B, obsługa zgłoszeń L1/L2." },
        { company: "Digital Warehouse", role: "Junior Developer", startDate: "2019-01", endDate: "2020-05", description: "Rozwój aplikacji webowych, współpraca z zespołem developerskim." },
        { company: "Bank Millennium", role: "IT Support", startDate: "2017-06", endDate: "2018-12", description: "Wsparcie techniczne dla pracowników banku, administracja stacjami roboczymi." },
        { company: "Capgemini", role: "Service Desk Analyst", startDate: "2015-09", endDate: "2017-05", description: "Helpdesk L1, obsługa zgłoszeń serwisowych." },
    ]}},
    { portfolio: portfolioId, type: "skills", order: 40, visible: true, skillsData: { categories: [
        { name: "Systemy operacyjne", skills: "Windows Server\nLinux (Ubuntu)\nActive Directory\nGPO" },
        { name: "Programowanie", skills: "Python\nJavaScript\nSQL\nBash scripting" },
        { name: "Narzędzia IT", skills: "JIRA\nServiceNow\nZendesk\nVMware\nHyper-V" },
        { name: "Sieci", skills: "TCP/IP\nDNS / DHCP\nVPN\nFirewall\nLAN / WAN" },
    ]}},
    { portfolio: portfolioId, type: "education", order: 50, visible: true, educationData: { items: [
        { school: "Politechnika Wrocławska", degree: "Inżynier", field: "Informatyka", startYear: 2013, endYear: 2018 },
    ]}},
    { portfolio: portfolioId, type: "contact", order: 60, visible: true, contactData: {
        linkedin: "https://www.linkedin.com/in/milosz-gawlik/",
        showForm: false,
    }},
  ];
}

function getMartynablocks(portfolioId: string | number) {
  return [
    { portfolio: portfolioId, type: "hero", order: 10, visible: true, heroData: {
        title: "Martyna Stawiszyńska", subtitle: "Autorka | Nancy Martin",
    }},
    { portfolio: portfolioId, type: "about", order: 20, visible: true, aboutData: {
        bio: `Jestem autorką książek piszącą pod pseudonimem Nancy Martin. Tworzę opowieści, które poruszają emocje i zmuszają do refleksji.

Moje książki łączą elementy psychologiczne z dramatycznym napięciem, tworząc światy, w których bohaterowie muszą zmierzyć się z własnymi lękami i pragnieniami.`,
    }},
    { portfolio: portfolioId, type: "skills", order: 30, visible: true, skillsData: { categories: [
        { name: "Gatunki literackie", skills: "Thriller psychologiczny\nDramat obyczajowy\nRomans\nLiteratura faktu" },
        { name: "Warsztaty i narzędzia", skills: "Scrivener\nRedakcja tekstów\nKorekta\nMarketing literacki\nMedia społecznościowe" },
    ]}},
    { portfolio: portfolioId, type: "books", order: 40, visible: true, booksData: { items: [
        {
          title: "Tytuł książki 1",
          year: 2023,
          coverUrl: "",
          description: "Opis pierwszej książki — uzupełnij w panelu admina.",
          genre: "Thriller psychologiczny",
          buyUrl: "",
          isAvailable: true,
        },
        {
          title: "Tytuł książki 2",
          year: 2021,
          coverUrl: "",
          description: "Opis drugiej książki — uzupełnij w panelu admina.",
          genre: "Dramat obyczajowy",
          buyUrl: "",
          isAvailable: true,
        },
    ]}},
    { portfolio: portfolioId, type: "contact", order: 60, visible: true, contactData: {
        email: "martyna.stawiszynska@gmail.com",
        showForm: true,
    }},
  ];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  // 1. Superadmin
  const existingAdmin = await payload.find({
    collection: "users",
    where: { email: { equals: SUPERADMIN.email } },
    limit: 1,
    overrideAccess: true,
  });

  let superadminId: string | number;
  if (existingAdmin.docs.length) {
    superadminId = existingAdmin.docs[0].id;
    console.log(`✓ Superadmin exists: ${SUPERADMIN.email}`);
  } else {
    const admin = await payload.create({
      collection: "users",
      data: { email: SUPERADMIN.email, password: SUPERADMIN.password, role: "superadmin" },
      overrideAccess: true,
    });
    superadminId = admin.id;
    console.log(`✓ Created superadmin: ${SUPERADMIN.email} (password: ${SUPERADMIN.password})`);
    console.log("  ⚠  Zmień hasło po zalogowaniu na /admin → Users!");
  }

  // 2. Owner accounts for Miłosz and Martyna
  const owners: Record<string, string | number> = {};
  const ownerDefs = [
    { email: "milosz@portfoliohub.dev", password: "Zmien123!", firstName: "Miłosz", lastName: "Gawlik" },
    { email: "martyna.stawiszynska@gmail.com", password: "Zmien123!", firstName: "Martyna", lastName: "Stawiszyńska" },
  ];

  for (const o of ownerDefs) {
    const existing = await payload.find({
      collection: "users",
      where: { email: { equals: o.email } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.docs.length) {
      owners[o.email] = existing.docs[0].id;
      console.log(`✓ User exists: ${o.email}`);
    } else {
      const u = await payload.create({
        collection: "users",
        data: { email: o.email, password: o.password, role: "owner", firstName: o.firstName, lastName: o.lastName },
        overrideAccess: true,
      });
      owners[o.email] = u.id;
      console.log(`✓ Created user: ${o.email}`);
    }
  }

  // 3. Portfolios + blocks
  const portfolioConfigs = [
    { ...PORTFOLIOS[0], ownerEmail: SUPERADMIN.email, getBlocks: getRadekBlocks },
    { ...PORTFOLIOS[1], ownerEmail: "milosz@portfoliohub.dev", getBlocks: getMiloszBlocks },
    { ...PORTFOLIOS[2], ownerEmail: "martyna.stawiszynska@gmail.com", getBlocks: getMartynablocks },
  ];

  for (const pc of portfolioConfigs) {
    const ownerId = pc.ownerEmail === SUPERADMIN.email ? superadminId : owners[pc.ownerEmail];

    const existing = await payload.find({
      collection: "portfolios",
      where: { subdomain: { equals: pc.subdomain } },
      limit: 1,
      overrideAccess: true,
    });

    let portfolioId: string | number;
    if (existing.docs.length) {
      portfolioId = existing.docs[0].id;
      console.log(`\n↩  Portfolio "${pc.subdomain}" already exists — updating metadata`);
      await payload.update({
        collection: "portfolios",
        id: portfolioId,
        data: {
          theme: pc.theme,
          ...(pc.cvPdfPl ? { cvPdfPl: pc.cvPdfPl } : {}),
          ...((pc as Record<string, unknown>).cvPdfEn ? { cvPdfEn: (pc as Record<string, unknown>).cvPdfEn as string } : {}),
          contactEmail: pc.contactEmail,
          owner: ownerId,
        },
        overrideAccess: true,
      });
    } else {
      console.log(`\n── Portfolio: ${pc.subdomain} ──`);
      const portfolio = await payload.create({
        collection: "portfolios",
        data: {
          subdomain: pc.subdomain,
          owner: ownerId,
          type: pc.type,
          theme: pc.theme,
          language: pc.language,
          isPublished: true,
          contactEmail: pc.contactEmail,
          seoTitle: pc.seoTitle,
          seoDescription: pc.seoDescription,
          ...(pc.cvPdfPl ? { cvPdfPl: pc.cvPdfPl } : {}),
          ...((pc as Record<string, unknown>).cvPdfEn ? { cvPdfEn: (pc as Record<string, unknown>).cvPdfEn as string } : {}),
        },
        overrideAccess: true,
      });
      portfolioId = portfolio.id;
      console.log(`✓ Created portfolio "${pc.subdomain}" (id: ${portfolioId})`);
    }

    // Seed blocks (skip if any exist)
    const existingBlocks = await payload.find({
      collection: "blocks",
      where: { portfolio: { equals: portfolioId } },
      limit: 1,
      overrideAccess: true,
    });

    if (existingBlocks.docs.length > 0) {
      console.log(`  ↩  Blocks already exist — skipping`);
      continue;
    }

    const blocks = pc.getBlocks(portfolioId);
    for (const block of blocks) {
      await payload.create({
        collection: "blocks",
        data: block,
        locale: "pl",
        overrideAccess: true,
      });
    }
    console.log(`  ✓ ${blocks.length} blocks created`);
  }

  console.log("\n✅ Neon seed complete!");
  console.log(`   Superadmin: ${SUPERADMIN.email} / ${SUPERADMIN.password}`);
  console.log("   ⚠  Zmień hasło po zalogowaniu na /admin → Users!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
