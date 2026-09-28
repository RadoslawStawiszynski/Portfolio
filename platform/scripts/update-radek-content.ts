/**
 * Aktualizacja treści portfolio "radek" (hero, about, experience, skills, education)
 * na podstawie aktualnego CV (2026-09). Idempotentny — nadpisuje dane istniejących bloków.
 *
 * Dane w seed-radek.ts były nieaktualne (m.in. własny projekt PortfolioHub podany jako
 * stanowisko), dlatego ten skrypt zastępuje tylko treść, nie tworzy nowych bloków.
 *
 * Uruchom: npx tsx scripts/update-radek-content.ts
 * Neon:    DATABASE_URL="postgresql://..." npx tsx scripts/update-radek-content.ts
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

type Locale = "pl" | "en";

const AVATAR = "/images/radek-avatar.jpg";

const hero = {
  pl: {
    title: "Radosław Stawiszyński",
    subtitle: "Project Manager z kompetencjami technicznymi · student informatyki",
    ctaLabel: "Skontaktuj się",
    ctaHref: "#contact",
    avatarUrl: AVATAR,
  },
  en: {
    title: "Radosław Stawiszyński",
    subtitle: "Project Manager with technical skills · Computer Science student",
    ctaLabel: "Get in touch",
    ctaHref: "#contact",
    avatarUrl: AVATAR,
  },
};

const about = {
  pl: {
    bio: "Studiuję informatykę na ostatnim roku studiów inżynierskich i od kilku lat koordynuję zespoły oraz projekty techniczne — od telekomunikacji i fotowoltaiki po smart home. Na co dzień prowadzę biuro projektowe: pilnuję terminów, dokumentacji, zaopatrzenia i współpracy z wykonawcami.\n\nRównolegle rozwijam kompetencje programistyczne (Python, TypeScript, Next.js, PostgreSQL), korzystam z narzędzi AI w codziennej pracy i buduję własną platformę PortfolioHub. Dzięki temu rozumiem język zespołów technicznych i potrafię weryfikować założenia projektowe.\n\nSzukam pierwszej roli w IT — koordynatora projektów lub junior PM — w której połączę doświadczenie w prowadzeniu zespołów z pracą blisko technologii i będę się dalej uczyć.",
  },
  en: {
    bio: "I am a final-year Computer Science (engineering) student and for several years I have been coordinating teams and technical projects — from telecommunications and photovoltaics to smart home systems. Day to day I run a design office: I keep track of deadlines, documentation, procurement and cooperation with contractors.\n\nAt the same time I am building my programming skills (Python, TypeScript, Next.js, PostgreSQL), I use AI tools in my daily work and I am building my own platform, PortfolioHub. This lets me speak the language of technical teams and verify project assumptions.\n\nI am looking for my first role in IT — a project coordinator or junior PM position — where I can combine my experience in leading teams with hands-on work close to technology, and keep learning.",
  },
};

const experience = {
  pl: [
    {
      company: "CBM Radosław Stawiszyński (działalność własna, B2B)",
      role: "Kierownik Biura Projektowego",
      startDate: "2021-03",
      description: [
        "Zarządzanie biurem projektowym instalacji fotowoltaicznych, pomp ciepła i systemów Smart Home (Grenton)",
        "Kierowanie działem logistycznym, magazynem i zamówieniami; koordynacja zespołów montażowych",
        "Wdrażanie narzędzi AI i automatyzacji procesów biurowych (Claude, ChatGPT, skrypty w Pythonie)",
        "Administracja infrastrukturą IT: serwery Linux, lokalne modele LLM (Ollama)",
      ].join("\n"),
    },
    {
      company: "Expertel Serwis – Katowice",
      role: "Koordynator ds. Technicznych",
      startDate: "2019-10",
      endDate: "2020-09",
      description: [
        "Koordynowanie pracy zespołów telekomunikacyjnych i fotowoltaicznych",
        "Nadzór nad postępem prac, przygotowanie dokumentacji i raportowanie; współpraca z inwestorami i dostawcami",
        "Koordynacja magazynu i zamawianie towaru",
      ].join("\n"),
    },
    {
      company: "Optical Core / Qi Connect",
      role: "Technik Telekomunikacji / Koordynator zespołu (15 osób)",
      startDate: "2018-04",
      endDate: "2019-08",
      description: [
        "Koordynowanie pracy zespołu, nadzór nad postępem prac",
        "Zaopatrzenie materiałowe, rozliczenia z firmami zewnętrznymi, raportowanie",
        "Rekrutacja nowych pracowników; współpraca z jednostkami administracyjnymi i inwestorami",
      ].join("\n"),
    },
    {
      company: "Creative Ceramika Sp. z o.o.",
      role: "Projektant graficzno-procesowy",
      startDate: "2016-07",
      endDate: "2018-01",
      description: [
        "Wdrażanie nowych projektów i koordynacja linii produkcyjnej drukarki cyfrowej (zespół 4–5 osób)",
        "Tworzenie technologii produkcji płytek ceramicznych z użyciem grawera laserowego",
        "Współpraca z zespołem technicznym we Włoszech (w języku angielskim)",
      ].join("\n"),
    },
  ],
  en: [
    {
      company: "CBM Radosław Stawiszyński (own business, B2B)",
      role: "Head of Design Office",
      startDate: "2021-03",
      description: [
        "Managing a design office for photovoltaic installations, heat pumps and Smart Home systems (Grenton)",
        "Leading logistics, warehouse and procurement; coordinating installation teams",
        "Introducing AI tools and office process automation (Claude, ChatGPT, Python scripts)",
        "Administering IT infrastructure: Linux servers, local LLM models (Ollama)",
      ].join("\n"),
    },
    {
      company: "Expertel Serwis – Katowice",
      role: "Technical Coordinator",
      startDate: "2019-10",
      endDate: "2020-09",
      description: [
        "Coordinating telecommunications and photovoltaic teams",
        "Supervising work progress, preparing documentation and reporting; working with investors and suppliers",
        "Coordinating the warehouse and ordering goods",
      ].join("\n"),
    },
    {
      company: "Optical Core / Qi Connect",
      role: "Telecommunications Technician / Team Coordinator (15 people)",
      startDate: "2018-04",
      endDate: "2019-08",
      description: [
        "Coordinating the team and supervising work progress",
        "Material procurement, settlements with external companies, reporting",
        "Recruiting new employees; cooperating with administrative units and investors",
      ].join("\n"),
    },
    {
      company: "Creative Ceramika Sp. z o.o.",
      role: "Graphic & Process Designer",
      startDate: "2016-07",
      endDate: "2018-01",
      description: [
        "Implementing new projects and coordinating the digital printer production line (team of 4–5)",
        "Creating ceramic tile production technology using a laser engraver",
        "Cooperating with the technical team in Italy (in English)",
      ].join("\n"),
    },
  ],
};

const skills = {
  pl: [
    { name: "Project Management", skills: "Agile / Scrum\nKanban\nPlanowanie i harmonogramy\nZarządzanie ryzykiem\nRaportowanie\nBPMN\nJira / Confluence\nMS Project" },
    { name: "Programowanie", skills: "Python\nTypeScript / JavaScript\nSQL (PostgreSQL)\nHTTP / REST API" },
    { name: "Web i CMS", skills: "Next.js 15\nReact\nTailwind CSS\nPayload CMS 3\nPrisma ORM\nHTML / CSS" },
    { name: "Bazy danych i DevOps", skills: "PostgreSQL 16\nRedis\nNeon\nDocker / Compose\nGit / GitHub\nLinux (Ubuntu)\nVercel\nCloudflare" },
    { name: "AI i automatyzacja", skills: "Claude AI\nChatGPT\nOllama (lokalne LLM)\nPython scripting\nAutomatyzacja procesów" },
    { name: "Narzędzia", skills: "VS Code\nPyCharm\nMS Office 365\nGoogle Workspace\nSlack / Teams\nPV Sol / PV Sys" },
    { name: "Kompetencje", skills: "Zarządzanie zespołem\nZarządzanie czasem\nSkrupulatność i odpowiedzialność\nCzytanie dokumentacji projektowej i elektrycznej" },
    { name: "Języki i uprawnienia", skills: "Polski – ojczysty\nAngielski – B2+\nNiemiecki – A1\nUprawnienia SEP D1, E1\nPrawo jazdy kat. B" },
  ],
  en: [
    { name: "Project Management", skills: "Agile / Scrum\nKanban\nPlanning & schedules\nRisk management\nReporting\nBPMN\nJira / Confluence\nMS Project" },
    { name: "Programming", skills: "Python\nTypeScript / JavaScript\nSQL (PostgreSQL)\nHTTP / REST API" },
    { name: "Web & CMS", skills: "Next.js 15\nReact\nTailwind CSS\nPayload CMS 3\nPrisma ORM\nHTML / CSS" },
    { name: "Databases & DevOps", skills: "PostgreSQL 16\nRedis\nNeon\nDocker / Compose\nGit / GitHub\nLinux (Ubuntu)\nVercel\nCloudflare" },
    { name: "AI & Automation", skills: "Claude AI\nChatGPT\nOllama (local LLMs)\nPython scripting\nProcess automation" },
    { name: "Tools", skills: "VS Code\nPyCharm\nMS Office 365\nGoogle Workspace\nSlack / Teams\nPV Sol / PV Sys" },
    { name: "Competencies", skills: "Team management\nTime management\nThoroughness & responsibility\nReading project and electrical documentation" },
    { name: "Languages & licences", skills: "Polish – native\nEnglish – B2+\nGerman – A1\nSEP D1, E1 electrical licence\nCategory B driving licence" },
  ],
};

const education = {
  pl: [
    {
      school: "Akademia Humanistyczno-Ekonomiczna w Łodzi",
      degree: "Studia inżynierskie — ostatni rok",
      field: "Informatyka · studia niestacjonarne",
      description:
        "Jestem studentem ostatniego roku informatyki. Studiuję w trybie niestacjonarnym, łącząc naukę z prowadzeniem biura projektowego i rozwijaniem własnej platformy PortfolioHub (Next.js, Payload CMS, PostgreSQL). Wiedzę ze studiów na bieżąco stosuję w praktyce.",
      startYear: 2023,
    },
    {
      school: "Politechnika Gdańska",
      degree: "Studia przerwane",
      field: "Chemia ogólna",
      description: "",
      startYear: 2012,
      endYear: 2013,
    },
    {
      school: "I LO im. Marii Curie-Skłodowskiej w Tczewie",
      degree: "Matura",
      field: "Profil matematyczno-przyrodniczy",
      description: "",
      startYear: 2008,
      endYear: 2012,
    },
  ],
  en: [
    {
      school: "Academy of Humanities and Economics in Łódź",
      degree: "Engineering studies — final year",
      field: "Computer Science · part-time studies",
      description:
        "I am a final-year Computer Science student. I study part-time, combining my studies with running a design office and developing my own platform, PortfolioHub (Next.js, Payload CMS, PostgreSQL). I apply what I learn in practice as I go.",
      startYear: 2023,
    },
    {
      school: "Gdańsk University of Technology",
      degree: "Studies discontinued",
      field: "General Chemistry",
      description: "",
      startYear: 2012,
      endYear: 2013,
    },
    {
      school: "I High School im. Marii Curie-Skłodowskiej in Tczew",
      degree: "High School Diploma",
      field: "Mathematics and science profile",
      description: "",
      startYear: 2008,
      endYear: 2012,
    },
  ],
};

const ARRAY_FIELDS: Record<string, [string, string]> = {
  experience: ["experienceData", "items"],
  skills: ["skillsData", "categories"],
  education: ["educationData", "items"],
};

async function run() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  const found = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: "radek" } },
    limit: 1,
    overrideAccess: true,
  });
  if (!found.docs.length) {
    console.error('Brak portfolio "radek" — najpierw seed-radek.ts / seed-neon.ts');
    process.exit(1);
  }
  const portfolioId = found.docs[0].id;

  await payload.update({
    collection: "portfolios",
    id: portfolioId,
    data: {
      theme: "light",
      seoTitle: "Radosław Stawiszyński — Project Manager z kompetencjami technicznymi",
      seoDescription:
        "Portfolio Radosława Stawiszyńskiego: koordynator projektów technicznych, student informatyki (ostatni rok). Python, TypeScript, Next.js, PostgreSQL.",
    },
    overrideAccess: true,
  });

  const blockPayload: Record<string, (l: Locale) => Record<string, unknown>> = {
    hero: (l) => ({ heroData: hero[l] }),
    about: (l) => ({ aboutData: about[l] }),
    experience: (l) => ({ experienceData: { items: experience[l] } }),
    skills: (l) => ({ skillsData: { categories: skills[l] } }),
    education: (l) => ({ educationData: { items: education[l] } }),
  };

  for (const [type, build] of Object.entries(blockPayload)) {
    const res = await payload.find({
      collection: "blocks",
      where: { and: [{ portfolio: { equals: portfolioId } }, { type: { equals: type } }] },
      limit: 1,
      overrideAccess: true,
    });
    if (!res.docs.length) {
      console.warn(`  ! brak bloku "${type}" — pomijam`);
      continue;
    }
    const blockId = res.docs[0].id;
    // Wiersze tablic są współdzielone między lokalizacjami: update w EN bez `id` tworzy je od nowa
    // i kasuje teksty PL. Dlatego PL najpierw, potem EN z id odczytanymi z zapisanych wierszy.
    await payload.update({ collection: "blocks", id: blockId, locale: "pl", data: build("pl"), overrideAccess: true });

    const enData = build("en");
    const arrayPath = ARRAY_FIELDS[type];
    if (arrayPath) {
      const saved = (await payload.findByID({ collection: "blocks", id: blockId, locale: "pl", depth: 0, overrideAccess: true })) as unknown as Record<string, Record<string, { id: string }[]>>;
      const rows = saved[arrayPath[0]][arrayPath[1]];
      const enRows = (enData[arrayPath[0]] as Record<string, Record<string, unknown>[]>)[arrayPath[1]];
      if (rows.length !== enRows.length) throw new Error(`${type}: różna liczba wierszy PL (${rows.length}) i EN (${enRows.length})`);
      enRows.forEach((row, i) => { row.id = rows[i].id; });
    }
    await payload.update({ collection: "blocks", id: blockId, locale: "en", data: enData, overrideAccess: true });
    console.log(`  ✓ ${type} (pl + en)`);
  }

  console.log("✓ Gotowe");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
