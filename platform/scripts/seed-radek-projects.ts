/**
 * Seed script — dodaje blok `projects` do portfolio Radosława.
 * Uruchom: npx tsx scripts/seed-radek-projects.ts
 */
import { loadEnvConfig } from "@next/env";
import path from "path";

loadEnvConfig(path.resolve(__dirname, ".."));

const PROJECTS = [
  {
    title: "PortfolioHub",
    description:
      "Wielodostępna platforma portfolio — Next.js 15, Payload CMS 3, PostgreSQL, Cloudflare R2, subdomain routing. Każdy użytkownik ma własne portfolio złożone z edytowalnych bloków z panelem admina.",
    tags: "Next.js, TypeScript, Payload CMS, PostgreSQL, Tailwind CSS, Cloudflare R2, Vercel",
    githubUrl: "https://github.com/RadoslawStawiszynski/Portfolio",
    status: "in-progress",
  },
  {
    title: "Lokalny Asystent AI",
    description:
      "Eksperyment z lokalnym LLM — custom Modelfile dla Qwen3-Coder-30B z polskim promptem systemowym. Skrypt diagnostyczny środowiska ML (torch, tensorflow, scikit-learn, numpy, pandas).",
    tags: "Python, Ollama, Qwen3, LLM, AI, Modelfile",
    status: "completed",
  },
  {
    title: "DB Connector",
    description:
      "Desktopowa aplikacja Python/Tkinter do łączenia z PostgreSQL, MSSQL i IBM DB2. 3-warstwowa architektura, szyfrowanie Fernet, walidacja danych, logger, PyInstaller packaging.",
    tags: "Python, Tkinter, PostgreSQL, MSSQL, IBM DB2, Fernet, PyInstaller",
    githubUrl: "https://github.com/RadoslawStawiszynski/Portfolio",
    status: "completed",
  },
  {
    title: "PortfolioHub — Nancy Card v1",
    description:
      "Prototyp portfolio dla autorki książek — Next.js, Supabase Auth, panel admin, CRUD postów i palet kolorów. Podstawa dla portfolio Martyny Stawiszyńskiej.",
    tags: "Next.js, Supabase, TypeScript, React",
    status: "archived",
  },
];

async function seed() {
  const { getPayload } = await import("payload");
  const { default: configPromise } = await import("../payload.config");
  const payload = await getPayload({ config: configPromise });

  const portfolio = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: "radek" } },
    limit: 1,
    overrideAccess: true,
  });

  if (!portfolio.docs.length) {
    console.error('Portfolio "radek" nie istnieje. Uruchom seed-radek.ts najpierw.');
    process.exit(1);
  }
  const portfolioId = portfolio.docs[0].id;

  // Check if projects block already exists
  const existing = await payload.find({
    collection: "blocks",
    where: {
      and: [
        { portfolio: { equals: portfolioId } },
        { type: { equals: "projects" } },
      ],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs.length) {
    console.log("✓ Blok `projects` już istnieje — skip");
    console.log("  Jeśli chcesz odświeżyć dane, usuń blok w /admin i uruchom ponownie.");
    process.exit(0);
  }

  await payload.create({
    collection: "blocks",
    data: {
      portfolio: portfolioId,
      type: "projects",
      order: 55,
      visible: true,
      projectsData: {
        items: PROJECTS,
      },
    },
    locale: "pl",
    overrideAccess: true,
  });

  console.log(`✓ Blok "projects" dodany do portfolio radek (${PROJECTS.length} projektów)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
