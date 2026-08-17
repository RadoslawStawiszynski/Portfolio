// platform/src/lib/invitation-tokens.ts
// Współdzielone przez join/page.tsx (walidacja przed renderem) i join/actions.ts
// (re-walidacja przy submit) — stąd osobny plik zamiast trzymania w page.tsx,
// które w Next.js App Router nie może eksportować nic poza dozwolonymi polami.
import { getPayload } from "payload";
import config from "@payload-config";
import { hashToken } from "@/lib/crypto";

export type TokenStatus = "missing" | "invalid" | "expired" | "used" | "valid";

export async function validateToken(
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
