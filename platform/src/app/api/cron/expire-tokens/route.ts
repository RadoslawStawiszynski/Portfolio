// platform/src/app/api/cron/expire-tokens/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });

  try {
    const now = new Date().toISOString();
    const expired = await payload.find({
      collection: "invitation-tokens",
      where: {
        and: [
          { status: { equals: "active" } },
          { expiresAt: { less_than: now } },
        ],
      },
      limit: 500,
      overrideAccess: true,
    });

    let count = 0;
    for (const token of expired.docs) {
      try {
        await payload.update({
          collection: "invitation-tokens",
          id: String(token.id),
          data: { status: "expired" },
          overrideAccess: true,
        });
        count++;
      } catch (tokenErr) {
        logger.error({ tokenId: token.id, err: tokenErr }, "Failed to expire token");
      }
    }

    logger.info({ count }, "Expired invitation tokens marked");
    return NextResponse.json({ expired: count }, { status: 200 });
  } catch (err) {
    logger.error({ err }, "Failed to run expire-tokens cron");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
