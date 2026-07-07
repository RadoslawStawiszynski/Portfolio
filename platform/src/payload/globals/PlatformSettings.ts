import type { GlobalConfig } from "payload";

export const PlatformSettings: GlobalConfig = {
  slug: "platform-settings",
  label: "Ustawienia Platformy",
  access: {
    read: ({ req }) => req.user?.role === "superadmin",
    update: ({ req }) => req.user?.role === "superadmin",
  },
  fields: [
    {
      name: "invitationsEnabled",
      type: "checkbox",
      label: "Włącz system zaproszeniowy",
      defaultValue: false,
      admin: {
        description:
          "Gdy włączone: formularz na landing page jest widoczny, /api/waitlist i /api/admin/invite działają.",
      },
    },
  ],
};
