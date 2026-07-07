import type { CollectionConfig } from "payload";
import { Resend } from "resend";
import { logger } from "@/lib/logger";

export const WaitlistRequests: CollectionConfig = {
  slug: "waitlist-requests",
  labels: { singular: "Zgłoszenie", plural: "Zgłoszenia (Waitlist)" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "status", "createdAt"],
    components: {
      edit: {
        // Renderuje przycisk "Wyślij zaproszenie" nad kontrolkami Save w widoku edycji
        beforeDocumentControls: [
          "/src/payload/components/SendInviteButton#SendInviteButton",
        ],
      },
    },
  },
  access: {
    create: () => false, // Tylko przez /api/waitlist z overrideAccess:true
    read: ({ req }) =>
      req.user?.role === "superadmin" || req.user?.role === "admin",
    update: ({ req }) =>
      req.user?.role === "superadmin" || req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "superadmin",
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation !== "create") return doc;
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const adminEmail = process.env.SUPERADMIN_EMAIL ?? "biuro@korp-cbm.com";
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? "noreply@korp-cbm.com",
            to: adminEmail,
            subject: `[PortfolioHub] Nowe zgłoszenie waitlist: ${doc.name}`,
            text: [
              `Nowe zgłoszenie do PortfolioHub:`,
              `Imię: ${doc.name}`,
              `Email: ${doc.email}`,
              doc.note ? `Notatka: ${doc.note}` : "",
              ``,
              `Zaloguj się do panelu admina, aby wysłać zaproszenie.`,
            ]
              .filter(Boolean)
              .join("\n"),
          });
          logger.info({ email: doc.email }, "Waitlist notification sent to admin");
        } catch (err) {
          logger.error({ err, email: doc.email }, "Failed to send waitlist notification — record saved");
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Imię i nazwisko",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
      required: true,
      unique: true,
    },
    {
      name: "note",
      type: "textarea",
      label: "Notatka (opcjonalne)",
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Oczekuje", value: "pending" },
        { label: "Zaproszono", value: "invited" },
        { label: "Odrzucono", value: "rejected" },
      ],
    },
    {
      name: "invitedAt",
      type: "date",
      label: "Data zaproszenia",
      admin: { readOnly: true },
    },
  ],
};
