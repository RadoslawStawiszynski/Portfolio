import type { CollectionConfig } from "payload";

export const Portfolios: CollectionConfig = {
  slug: "portfolios",
  admin: {
    useAsTitle: "subdomain",
  },
  access: {
    read: () => true,
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
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Retro Terminal", value: "retro-terminal" },
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
  ],
};
