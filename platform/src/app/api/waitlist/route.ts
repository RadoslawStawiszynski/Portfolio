import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPayload } from "payload";
import config from "@payload-config";
import { logger } from "@/lib/logger";
import { checkWaitlistRateLimit } from "@/lib/rate-limit";

const WaitlistSchema = z.object({
  name: z.string().min(2, "Minimum 2 znaki").max(100),
  email: z.string().email("Nieprawidłowy email"),
  note: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const payload = await getPayload({ config });

  const settings = await payload.findGlobal({
    slug: "platform-settings",
    overrideAccess: true,
  });
  if (!settings.invitationsEnabled) {
    return NextResponse.json({ error: "invitations_disabled" }, { status: 403 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = await checkWaitlistRateLimit(ip);
  if (!allowed) {
    logger.warn({ ip }, "Rate limit exceeded on /api/waitlist");
    return NextResponse.json({ error: "rate_limit_exceeded" }, { status: 429 });
  }

  const { name, email, note } = parsed.data;

  try {
    await payload.create({
      collection: "waitlist-requests",
      data: { name, email, note: note ?? "", status: "pending" },
      overrideAccess: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes("unique") ||
      msg.toLowerCase().includes("duplicate")
    ) {
      return NextResponse.json({ error: "email_exists" }, { status: 409 });
    }
    logger.error({ err, email }, "Failed to create waitlist request");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  logger.info({ email }, "Waitlist request created");
  return NextResponse.json({ success: true }, { status: 201 });
}
