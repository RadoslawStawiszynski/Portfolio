// platform/src/app/(portfolio)/join/actions.ts
// Server Action wyodrębniony z page.tsx — Next.js App Router nie pozwala
// stronie eksportować nic poza default/generateMetadata/itp. ("registerWithToken"
// jako named export w page.tsx wywalał `next build` mimo że tsc --noEmit przechodził).
"use server";

import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { createPlaceholderBlocks } from "@/lib/placeholder-blocks";
import { logger } from "@/lib/logger";
import { validateToken } from "@/lib/invitation-tokens";

export async function registerWithToken(
  rawToken: string,
  subdomain: string,
  password: string
): Promise<{ error?: string }> {
  const payload = await getPayload({ config });
  const slug = subdomain.toLowerCase().trim();

  // Validate subdomain format
  if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
    return {
      error:
        "Subdomena musi mieć 3–30 znaków i zawierać tylko litery a-z, cyfry i myślniki.",
    };
  }

  // Check subdomain uniqueness
  const existing = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.totalDocs > 0) {
    return { error: "Ta subdomena jest już zajęta — wybierz inną." };
  }

  // Re-validate token (defense in depth)
  const { status, tokenId, email } = await validateToken(rawToken);
  if (status !== "valid" || !tokenId || !email) {
    return { error: "Token wygasł lub jest nieprawidłowy." };
  }

  // Create user — email comes from the invitation token, not the form
  let newUser: { id: string };
  try {
    newUser = (await payload.create({
      collection: "users",
      data: { email, password, role: "owner" },
      overrideAccess: true,
    })) as { id: string };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes("unique") ||
      msg.toLowerCase().includes("duplicate")
    ) {
      return {
        error: "Konto z tym emailem już istnieje. Spróbuj się zalogować.",
      };
    }
    logger.error({ err }, "Failed to create user on /join");
    return { error: "Błąd serwera podczas tworzenia konta." };
  }

  // Create portfolio + bloki + oznacz token — w bloku try z cleanup po błędzie
  try {
    const portfolio = (await payload.create({
      collection: "portfolios",
      data: {
        subdomain: slug,
        owner: newUser.id,
        type: "cv",
        theme: "light",
        colorScheme: "light",
        language: "pl",
        isPublished: false,
        contactEmail: email,
      },
      overrideAccess: true,
    })) as { id: string };

    // Create placeholder blocks so the portfolio is never empty on first visit
    const blocks = createPlaceholderBlocks(String(portfolio.id), email);
    for (const block of blocks) {
      await payload.create({
        collection: "blocks",
        data: block,
        overrideAccess: true,
      });
    }

    // Mark token as used
    await payload.update({
      collection: "invitation-tokens",
      id: tokenId,
      data: { status: "used", usedAt: new Date().toISOString() },
      overrideAccess: true,
    });
  } catch (err) {
    logger.error({ err, email }, "Failed to setup portfolio after user creation — attempting cleanup");
    // Best-effort: usuń usera żeby umożliwić retry z tym samym tokenem
    try {
      await payload.delete({ collection: "users", id: newUser.id, overrideAccess: true });
    } catch (cleanupErr) {
      logger.error({ cleanupErr, userId: newUser.id }, "Failed to cleanup user after portfolio setup error");
    }
    return { error: "Błąd serwera podczas konfiguracji portfolio. Spróbuj ponownie." };
  }

  logger.info({ email, subdomain: slug }, "New user registered via invitation");
  redirect("/admin");
}
