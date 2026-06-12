import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "owner",
      options: [
        { label: "Super Admin", value: "superadmin" },
        { label: "Admin", value: "admin" },
        { label: "Owner", value: "owner" },
      ],
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
  ],
};
