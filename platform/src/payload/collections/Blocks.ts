import type { CollectionConfig } from "payload";

const BLOCK_TYPES = [
  "hero",
  "about",
  "experience",
  "skills",
  "education",
  "contact",
  "projects",
  "books",
  "services",
  "gallery",
  "testimonials",
  "timeline",
  "stats",
  "cta",
  "faq",
] as const;

export const Blocks: CollectionConfig = {
  slug: "blocks",
  access: {
    read: async ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      const owned = await req.payload.find({
        collection: "portfolios",
        where: { owner: { equals: req.user.id } },
        limit: 100,
        overrideAccess: true,
        select: { id: true },
      });
      const ids = owned.docs.map((p) => p.id);
      return ids.length > 0 ? { portfolio: { in: ids } } : false;
    },
    create: async ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      const owned = await req.payload.find({
        collection: "portfolios",
        where: { owner: { equals: req.user.id } },
        limit: 1,
        overrideAccess: true,
        select: { id: true },
      });
      return owned.docs.length > 0;
    },
    update: async ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      const owned = await req.payload.find({
        collection: "portfolios",
        where: { owner: { equals: req.user.id } },
        limit: 100,
        overrideAccess: true,
        select: { id: true },
      });
      const ids = owned.docs.map((p) => p.id);
      return ids.length > 0 ? { portfolio: { in: ids } } : false;
    },
    delete: ({ req }) => {
      return req.user?.role === "superadmin" || req.user?.role === "admin";
    },
  },
  admin: {
    useAsTitle: "type",
    defaultColumns: ["type", "portfolio", "order", "visible"],
  },
  fields: [
    {
      name: "portfolio",
      type: "relationship",
      relationTo: "portfolios",
      required: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: BLOCK_TYPES.map((t) => ({ label: t, value: t })),
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        description: "Display order — lower = first. Steps of 10 recommended (10, 20, 30...)",
      },
    },
    {
      name: "visible",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "themeOverride",
      type: "select",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Retro Terminal", value: "retro-terminal" },
      ],
    },

    // ─── HERO ────────────────────────────────────────────────────
    {
      name: "heroData",
      type: "group",
      admin: {
        condition: (data) => data.type === "hero",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          localized: true,
          admin: { description: "Imię i nazwisko lub główny nagłówek" },
        },
        {
          name: "subtitle",
          type: "text",
          localized: true,
          admin: { description: "Podtytuł / stanowisko" },
        },
        {
          name: "avatarUrl",
          type: "text",
          admin: { description: "URL zdjęcia profilowego (wgraj do Media, skopiuj URL)" },
        },
        {
          name: "ctaLabel",
          type: "text",
          localized: true,
          admin: { description: "Tekst przycisku CTA (np. 'Pobierz CV')" },
        },
        {
          name: "ctaHref",
          type: "text",
          admin: { description: "Link przycisku CTA (URL lub #sekcja)" },
        },
      ],
    },

    // ─── ABOUT ───────────────────────────────────────────────────
    {
      name: "aboutData",
      type: "group",
      admin: {
        condition: (data) => data.type === "about",
      },
      fields: [
        {
          name: "bio",
          type: "textarea",
          required: true,
          localized: true,
          admin: { description: "Opis / biogram" },
        },
        {
          name: "photoUrl",
          type: "text",
          admin: { description: "URL zdjęcia (wgraj do Media, skopiuj URL)" },
        },
      ],
    },

    // ─── EXPERIENCE ──────────────────────────────────────────────
    {
      name: "experienceData",
      type: "group",
      admin: {
        condition: (data) => data.type === "experience",
      },
      fields: [
        {
          name: "items",
          type: "array",
          admin: { description: "Lista doświadczeń — od najnowszego" },
          fields: [
            {
              name: "company",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "role",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "startDate",
              type: "text",
              required: true,
              admin: { description: "Format: YYYY-MM (np. 2021-03)" },
            },
            {
              name: "endDate",
              type: "text",
              admin: { description: "Format: YYYY-MM — zostaw puste jeśli 'obecnie'" },
            },
            {
              name: "description",
              type: "textarea",
              localized: true,
            },
          ],
        },
      ],
    },

    // ─── SKILLS ──────────────────────────────────────────────────
    {
      name: "skillsData",
      type: "group",
      admin: {
        condition: (data) => data.type === "skills",
      },
      fields: [
        {
          name: "categories",
          type: "array",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              localized: true,
              admin: { description: "Nazwa kategorii (np. Frontend, Backend)" },
            },
            {
              name: "skills",
              type: "textarea",
              admin: {
                description: "Jedna umiejętność na linię (np. React\\nTypeScript\\nNext.js)",
              },
            },
          ],
        },
      ],
    },

    // ─── EDUCATION ───────────────────────────────────────────────
    {
      name: "educationData",
      type: "group",
      admin: {
        condition: (data) => data.type === "education",
      },
      fields: [
        {
          name: "items",
          type: "array",
          fields: [
            {
              name: "school",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "degree",
              type: "text",
              required: true,
              localized: true,
              admin: { description: "Tytuł (np. Licencjat, Magister)" },
            },
            {
              name: "field",
              type: "text",
              localized: true,
              admin: { description: "Kierunek studiów" },
            },
            {
              name: "startYear",
              type: "number",
              required: true,
            },
            {
              name: "endYear",
              type: "number",
              admin: { description: "Zostaw puste jeśli w trakcie" },
            },
          ],
        },
      ],
    },

    // ─── PROJECTS ────────────────────────────────────────────────
    {
      name: "projectsData",
      type: "group",
      admin: {
        condition: (data) => data.type === "projects",
      },
      fields: [
        {
          name: "items",
          type: "array",
          admin: { description: "Lista projektów — od najnowszego" },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "description",
              type: "textarea",
              localized: true,
            },
            {
              name: "tags",
              type: "text",
              admin: { description: "Tagi/technologie oddzielone przecinkiem (np. React, TypeScript, Next.js)" },
            },
            {
              name: "url",
              type: "text",
              admin: { description: "Link do projektu (opcjonalny)" },
            },
            {
              name: "githubUrl",
              type: "text",
              admin: { description: "Link do GitHub (opcjonalny)" },
            },
            {
              name: "status",
              type: "select",
              defaultValue: "completed",
              options: [
                { label: "Ukończony", value: "completed" },
                { label: "W trakcie", value: "in-progress" },
                { label: "Zarchiwizowany", value: "archived" },
              ],
            },
          ],
        },
      ],
    },

    // ─── CONTACT ─────────────────────────────────────────────────
    {
      name: "contactData",
      type: "group",
      admin: {
        condition: (data) => data.type === "contact",
      },
      fields: [
        {
          name: "email",
          type: "email",
          admin: { description: "Publiczny email kontaktowy" },
        },
        {
          name: "phone",
          type: "text",
        },
        {
          name: "linkedin",
          type: "text",
          admin: { description: "URL profilu LinkedIn" },
        },
        {
          name: "github",
          type: "text",
          admin: { description: "URL profilu GitHub" },
        },
        {
          name: "showForm",
          type: "checkbox",
          defaultValue: true,
          admin: { description: "Pokaż formularz kontaktowy" },
        },
      ],
    },
  ],
};
