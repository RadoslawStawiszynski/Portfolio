"use server";
import { z } from "zod";
import { Resend } from "resend";
import { getPayload } from "payload";
import { headers } from "next/headers";
import config from "@payload-config";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

const ContactSchema = z.object({
  portfolioSlug: z.string().min(1),
  name: z.string().min(2, "Minimum 2 znaki").max(100),
  email: z.string().email("Nieprawidłowy email"),
  message: z.string().min(10, "Minimum 10 znaków").max(2000),
});

export type ContactState =
  | { success: true }
  | { error: "validation"; fields: Record<string, string[]> }
  | { error: "rate_limit_exceeded" }
  | { error: "portfolio_not_found" }
  | { error: "email_failed" };

if (!process.env.RESEND_API_KEY) {
  logger.warn("RESEND_API_KEY is not set — contact emails will fail");
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(
  _prevState: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    portfolioSlug: formData.get("portfolioSlug"),
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "validation",
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { portfolioSlug, name, email, message } = parsed.data;

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    logger.warn({ ip, portfolioSlug }, "Rate limit exceeded on sendContactMessage");
    return { error: "rate_limit_exceeded" };
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: portfolioSlug } },
    limit: 1,
  });

  if (result.totalDocs === 0) {
    return { error: "portfolio_not_found" };
  }

  const portfolio = result.docs[0];
  const contactEmail =
    (portfolio.contactEmail as string | null | undefined) ?? "biuro@korp-cbm.com";

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@korp-cbm.com",
      to: contactEmail,
      subject: `Nowa wiadomość z portfolio ${portfolioSlug}`,
      text: `Imię: ${name}\nEmail nadawcy: ${email}\n\n${message}`,
    });
  } catch (err) {
    logger.error({ err, portfolioSlug }, "Failed to send contact email via Server Action");
    return { error: "email_failed" };
  }

  logger.info({ portfolioSlug, ip, remaining }, "Contact email sent via Server Action");
  return { success: true };
}
