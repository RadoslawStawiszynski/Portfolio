import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getPayload } from "payload";
import config from "@payload-config";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";

const ContactSchema = z.object({
  portfolioSlug: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // 1. Walidacja body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { portfolioSlug, name, email, message } = parsed.data;

  // 2. Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed, remaining } = await checkRateLimit(ip);
  if (!allowed) {
    logger.warn({ ip, portfolioSlug }, "Rate limit exceeded on /api/contact");
    return NextResponse.json(
      { error: "rate_limit_exceeded" },
      {
        status: 429,
        headers: { "Retry-After": "900" },
      }
    );
  }

  // 3. Pobierz portfolio z DB
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: portfolioSlug } },
    limit: 1,
  });

  if (result.totalDocs === 0) {
    return NextResponse.json(
      { error: "portfolio_not_found" },
      { status: 404 }
    );
  }

  const portfolio = result.docs[0];
  const contactEmail =
    (portfolio.contactEmail as string | null | undefined) || "biuro@korp-cbm.com";

  // 4. Wyślij email
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@korp-cbm.com",
      to: contactEmail,
      subject: `Nowa wiadomość z portfolio ${portfolioSlug}`,
      text: `Imię: ${name}\nEmail nadawcy: ${email}\n\n${message}`,
    });
  } catch (err) {
    logger.error({ err, portfolioSlug }, "Failed to send contact email");
    return NextResponse.json({ error: "email_failed" }, { status: 500 });
  }

  logger.info(
    { portfolioSlug, ip, remaining },
    "Contact email sent successfully"
  );

  return NextResponse.json({ success: true }, { status: 200 });
}
