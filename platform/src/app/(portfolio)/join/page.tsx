import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { hashToken } from "@/lib/crypto";
import { createPlaceholderBlocks } from "@/lib/placeholder-blocks";
import { JoinForm } from "@/components/join/JoinForm";
import { logger } from "@/lib/logger";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";

type TokenStatus = "missing" | "invalid" | "expired" | "used" | "valid";

async function validateToken(
  rawToken: string
): Promise<{ status: TokenStatus; tokenId?: string; email?: string }> {
  const payload = await getPayload({ config });
  const tokenHash = hashToken(rawToken);

  const result = await payload.find({
    collection: "invitation-tokens",
    where: { token: { equals: tokenHash } },
    limit: 1,
    overrideAccess: true,
  });

  if (result.totalDocs === 0) return { status: "invalid" };

  const token = result.docs[0];

  if (token.status === "used") return { status: "used" };
  if (
    token.status === "expired" ||
    new Date(token.expiresAt as string) < new Date()
  ) {
    return { status: "expired" };
  }

  return {
    status: "valid",
    tokenId: String(token.id),
    email: token.email as string,
  };
}

export async function registerWithToken(
  rawToken: string,
  subdomain: string,
  password: string
): Promise<{ error?: string }> {
  "use server";
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

  // Create portfolio
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

  logger.info({ email, subdomain: slug }, "New user registered via invitation");
  redirect("/admin");
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const rawToken = params.token ?? "";

  const headersList = await headers();
  const portfolioSlug = headersList.get("x-portfolio-slug");

  // If opened from a portfolio subdomain, redirect to platform root so
  // the page renders under the platform domain (not the user subdomain)
  if (portfolioSlug) {
    const qs = rawToken ? `?token=${encodeURIComponent(rawToken)}` : "";
    redirect(`https://${PLATFORM_DOMAIN}/join${qs}`);
  }

  if (!rawToken) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[var(--color-primary)]">
          Wymagane zaproszenie
        </h1>
        <p className="mb-6 text-[var(--color-muted)]">
          Ta strona wymaga zaproszenia.
        </p>
        <a
          href={`https://${PLATFORM_DOMAIN}`}
          className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] hover:opacity-90"
        >
          Wróć na stronę główną
        </a>
      </div>
    );
  }

  const { status, email } = await validateToken(rawToken);

  if (status !== "valid") {
    const messages: Record<
      Exclude<TokenStatus, "valid" | "missing">,
      string
    > = {
      invalid: "Nieprawidłowy link zaproszeniowy.",
      expired: "Link wygasł (ważny 48h). Skontaktuj się z administratorem.",
      used: "Ten link został już wykorzystany.",
    };
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6 text-center">
        <h1 className="mb-4 text-2xl font-bold text-[var(--color-primary)]">
          Nieprawidłowy link
        </h1>
        <p className="mb-6 text-[var(--color-muted)]">
          {messages[status as Exclude<TokenStatus, "valid" | "missing">]}
        </p>
        <a
          href={`https://${PLATFORM_DOMAIN}`}
          className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] hover:opacity-90"
        >
          Wróć na stronę główną
        </a>
      </div>
    );
  }

  const registerAction = registerWithToken.bind(null, rawToken);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            Witaj w PortfolioHub!
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Utwórz konto dla <strong>{email}</strong>. Link ważny 48h.
          </p>
        </div>
        <JoinForm action={registerAction} platformDomain={PLATFORM_DOMAIN} />
      </div>
    </div>
  );
}
