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
  admin: {
    useAsTitle: "type",
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
        description: "Display order — lower number appears first",
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
    {
      name: "data",
      type: "group",
      fields: [
        {
          name: "pl",
          type: "json",
          required: true,
          admin: {
            description: "Block content in Polish (JSON object)",
          },
        },
        {
          name: "en",
          type: "json",
          admin: {
            description: "Block content in English — optional",
          },
        },
      ],
    },
  ],
};
