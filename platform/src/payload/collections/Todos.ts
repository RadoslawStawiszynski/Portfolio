import type { CollectionConfig } from "payload";

export const Todos: CollectionConfig = {
  slug: "todos",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "done", "portfolio", "updatedAt"],
    description: "Osobista lista zadań",
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      return { owner: { equals: req.user.id } };
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      return { owner: { equals: req.user.id } };
    },
    delete: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "superadmin" || req.user.role === "admin") return true;
      return { owner: { equals: req.user.id } };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "done",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "portfolio",
      type: "relationship",
      relationTo: "portfolios",
      admin: {
        description: "Opcjonalne — powiąż zadanie z konkretnym portfolio",
      },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
        description: "Właściciel zadania",
      },
    },
    {
      name: "notes",
      type: "textarea",
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !data.owner) {
          data.owner = req.user.id;
        }
        return data;
      },
    ],
  },
};
