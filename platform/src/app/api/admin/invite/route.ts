import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { Resend } from "resend";
import { getPayload } from "payload";
import config from "@payload-config";
import { logger } from "@/lib/logger";
import { hashToken } from "@/lib/crypto";

const InviteSchema = z.object({
  waitlistId: z.string().min(1),
});

const resend = new Resend(process.env.RESEND_API_KEY);
const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";
const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? `https://${PLATFORM_DOMAIN}`;

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config });

  // Sprawdź sesję — tylko superadmin
  const { user } = await payload.auth({ headers: req.headers });
  if (!user || user.role !== "superadmin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = InviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const { waitlistId } = parsed.data;

  // Sprawdź flagę
  const settings = await payload.findGlobal({
    slug: "platform-settings",
    overrideAccess: true,
  });
  if (!settings.invitationsEnabled) {
    return NextResponse.json({ error: "invitations_disabled" }, { status: 403 });
  }

  // Pobierz zgłoszenie
  const waitlistRequest = await payload.findByID({
    collection: "waitlist-requests",
    id: waitlistId,
    overrideAccess: true,
  });

  if (!waitlistRequest) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (waitlistRequest.status !== "pending") {
    return NextResponse.json({ error: "already_processed" }, { status: 409 });
  }

  // Generuj token
  const rawToken = randomUUID();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  // Zapisz token
  await payload.create({
    collection: "invitation-tokens",
    data: {
      token: tokenHash,
      waitlistRef: waitlistId,
      email: waitlistRequest.email as string,
      status: "active",
      expiresAt,
    },
    overrideAccess: true,
  });

  // Wyślij email
  const joinLink = `${SERVER_URL}/join?token=${rawToken}`;
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@korp-cbm.com",
      to: waitlistRequest.email as string,
      subject: "Twoje zaproszenie do PortfolioHub",
      text: [
        `Cześć ${waitlistRequest.name as string},`,
        ``,
        `Masz zaproszenie do PortfolioHub! Kliknij link, aby założyć konto:`,
        ``,
        joinLink,
        ``,
        `Link jest jednorazowy i ważny przez 48 godziny.`,
        ``,
        `Po rejestracji znajdziesz gotowe portfolio z przykładowymi danymi do edycji w panelu admina.`,
      ].join("\n"),
    });
  } catch (err) {
    logger.error({ err, waitlistId }, "Failed to send invitation email");
    return NextResponse.json({ error: "email_failed" }, { status: 500 });
  }

  // Zaktualizuj status zgłoszenia
  await payload.update({
    collection: "waitlist-requests",
    id: waitlistId,
    data: {
      status: "invited",
      invitedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  });

  logger.info({ waitlistId, email: waitlistRequest.email }, "Invitation sent");
  return NextResponse.json({ success: true }, { status: 200 });
}
