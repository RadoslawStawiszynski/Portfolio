import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { JoinForm } from "@/components/join/JoinForm";
import { validateToken, type TokenStatus } from "@/lib/invitation-tokens";
import { registerWithToken } from "./actions";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";

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
