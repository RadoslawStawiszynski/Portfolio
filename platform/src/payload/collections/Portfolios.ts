import type { CollectionConfig, Where } from "payload";

export const Portfolios: CollectionConfig = {
  slug: "portfolios",
  admin: {
    useAsTitle: "subdomain",
    livePreview: {
      // NEXT_PUBLIC_SERVER_URL zamiast req.headers.get("host") (TD-03) — host
      // requestu do admina bywa inny niż publiczny URL (Vercel deployment URL,
      // reverse proxy), więc preview trafiał na zły adres na produkcji.
      url: ({ data, req }) => {
        const slug = (data.subdomain as string) ?? "";
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        if (serverUrl) return `${serverUrl}/dev/${slug}`;
        const host = req.headers.get("host") ?? "localhost:3000";
        return `http://${host}/dev/${slug}`;
      },
    },
  },
  access: {
    read: ({ req }): boolean | Where => {
      if (!req.user) return { isPublished: { equals: true } };
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      return { owner: { equals: req.user.id } };
    },
    create: ({ req }) => {
      return req.user?.role === "superadmin" || req.user?.role === "admin";
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      return { owner: { equals: req.user.id } };
    },
    delete: ({ req }) => {
      return req.user?.role === "superadmin" || req.user?.role === "admin";
    },
  },
  fields: [
    {
      name: "subdomain",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "URL slug: radek → radek.korp-cbm.com",
      },
    },
    {
      name: "customDomain",
      type: "text",
      unique: true,
      admin: {
        description: "Optional custom domain (requires CNAME setup)",
      },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "cv",
      options: [
        { label: "CV / Personal", value: "cv" },
        { label: "Author", value: "author" },
        { label: "Company", value: "company" },
        { label: "Project", value: "project" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      name: "theme",
      type: "select",
      defaultValue: "light",
      options: [
        { label: "Light",       value: "light"          },
        { label: "Dark",        value: "dark"           },
        { label: "Terminal",    value: "retro-terminal" },
        { label: "Synthwave",   value: "synthwave"      },
        { label: "Amber",       value: "amber"          },
        { label: "Cyberpunk",   value: "cyberpunk"      },
        { label: "Teal Coral",  value: "teal-coral"     },
        { label: "Earth",       value: "earth"          },
        { label: "Slate Rose",  value: "slate-rose"     },
        { label: "Olive Gold",  value: "olive-gold"     },
      ],
    },
    {
      name: "colorScheme",
      type: "select",
      defaultValue: "light",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Auto (system)", value: "auto" },
      ],
    },
    {
      name: "language",
      type: "select",
      defaultValue: "pl",
      options: [
        { label: "Polish only", value: "pl" },
        { label: "English only", value: "en" },
        { label: "PL + EN (bilingual)", value: "pl-en" },
      ],
    },
    {
      name: "seoTitle",
      type: "text",
    },
    {
      name: "seoDescription",
      type: "textarea",
    },
    {
      name: "seoImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "isPublished",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "contactEmail",
      type: "email",
      defaultValue: "biuro@korp-cbm.com",
      admin: {
        description:
          "Email do odbierania wiadomości z formularza kontaktowego.",
      },
    },
    {
      name: "cvPdfPl",
      type: "text",
      admin: {
        description: "URL do CV PDF po polsku (np. link z Cloudflare R2)",
      },
    },
    {
      name: "cvPdfEn",
      type: "text",
      admin: {
        description: "URL do CV PDF po angielsku (opcjonalne, fallback PL jeśli brak)",
      },
    },
  ],
};
