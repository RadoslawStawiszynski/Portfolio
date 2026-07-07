import type { CollectionConfig } from "payload";

export const InvitationTokens: CollectionConfig = {
  slug: "invitation-tokens",
  labels: { singular: "Token zaproszeniowy", plural: "Tokeny zaproszeniowe" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "status", "expiresAt", "usedAt"],
    description:
      "Tokeny są tworzone automatycznie przez /api/admin/invite. W DB przechowywany jest SHA-256 hash tokenu — raw token wysyłany jest tylko emailem.",
  },
  access: {
    create: () => false,
    read: ({ req }) => req.user?.role === "superadmin",
    update: ({ req }) => req.user?.role === "superadmin",
    delete: ({ req }) => req.user?.role === "superadmin",
  },
  fields: [
    {
      name: "token",
      type: "text",
      label: "Token (SHA-256 hash)",
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: "waitlistRef",
      type: "relationship",
      relationTo: "waitlist-requests",
      label: "Zgłoszenie waitlist",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "email",
      type: "email",
      label: "Email zapraszanego",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Aktywny", value: "active" },
        { label: "Użyty", value: "used" },
        { label: "Wygasły", value: "expired" },
      ],
    },
    {
      name: "expiresAt",
      type: "date",
      label: "Wygasa o",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "usedAt",
      type: "date",
      label: "Użyty o",
      admin: { readOnly: true },
    },
  ],
};
