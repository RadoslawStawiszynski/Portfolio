# System Zaproszeniowy + Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zbudować end-to-end system zaproszeniowy: formularz "Dołącz" na landing page → admin wysyła zaproszenie → nowy użytkownik rejestruje konto przez `/join` i dostaje portfolio z placeholderami.

**Architecture:** Payload-native — kolekcje `WaitlistRequests` i `InvitationTokens` jako Payload Collections, logika biznesowa w Next.js API routes, Global `PlatformSettings` steruje feature flagą. Tokeny przechowywane jako SHA-256 hash (raw UUID tylko w emailu). GitHub Actions cron wygasza tokeny po 48h.

**Tech Stack:** Next.js 15 App Router, Payload CMS 3, PostgreSQL (Neon), Redis (Upstash), Resend, Zod, Node.js `crypto` (wbudowane), TypeScript 5, Tailwind CSS 4.

## Global Constraints

- Branch: `dev` — nigdy `main`
- Każdy task kończy się `npm run typecheck` (zero błędów) i commitem
- Nie używać `console.log` — tylko `logger` z `@/lib/logger`
- Nie commitować `.env.local`
- `payload.config.ts` jest w `platform/` (root), nie w `src/`
- Payload collections w `platform/src/payload/collections/`
- Payload globals w `platform/src/payload/globals/`
- Custom Payload components referencjonowane jako ścieżka string: `/src/payload/components/NazwaKomponentu#NazwaExportu`
- API routes w `platform/src/app/api/`
- Server Actions w `platform/src/app/(portfolio)/actions.ts` (lub osobny plik)
- Walidacja: Zod we wszystkich API routes i Server Actions
- Rate limiting: `checkRateLimit` z `@/lib/rate-limit` z własnym prefixem klucza Redis
- SUPERADMIN_EMAIL i CRON_SECRET — nowe env vars (dodać do `.env.example` i Vercel)

---

## Mapa plików

| Plik | Akcja | Odpowiedzialność |
|------|-------|-----------------|
| `platform/src/payload/globals/PlatformSettings.ts` | CREATE | Global z `invitationsEnabled` flag |
| `platform/src/payload/collections/WaitlistRequests.ts` | CREATE | Kolekcja zgłoszeń z waitlisty |
| `platform/src/payload/collections/InvitationTokens.ts` | CREATE | Kolekcja tokenów zaproszeniowych |
| `platform/payload.config.ts` | MODIFY | Dodaj globals + nowe collections |
| `platform/src/lib/crypto.ts` | CREATE | SHA-256 hash utility |
| `platform/src/lib/rate-limit.ts` | MODIFY | Dodaj `checkWaitlistRateLimit()` |
| `platform/src/app/api/waitlist/route.ts` | CREATE | POST — zapis do WaitlistRequests + email admin |
| `platform/src/payload/components/SendInviteButton.tsx` | CREATE | Client Component — przycisk "Wyślij zaproszenie" |
| `platform/src/app/api/admin/invite/route.ts` | CREATE | POST — generuj token + email zaproszeniowy |
| `platform/src/app/api/cron/expire-tokens/route.ts` | CREATE | GET — wygaszanie tokenów (GitHub Actions) |
| `platform/src/lib/placeholder-blocks.ts` | CREATE | `createPlaceholderBlocks(email)` |
| `platform/src/app/(portfolio)/join/page.tsx` | CREATE | Strona rejestracji przez zaproszenie |
| `platform/src/components/landing/WaitlistForm.tsx` | CREATE | Client Component — formularz "Dołącz" |
| `platform/src/components/landing/LandingPage.tsx` | MODIFY | Dodaj sekcję waitlist (warunkowo) |
| `platform/src/middleware.ts` | MODIFY | Dodaj "join" do RESERVED |
| `platform/.env.example` | MODIFY | Dodaj CRON_SECRET, SUPERADMIN_EMAIL |
| `.github/workflows/expire-tokens.yml` | CREATE | Cron wygasania tokenów |

---

## Task 1: Data model — PlatformSettings Global + Collections + payload.config

**Co budujesz:** Trzy Payload kolekcje/global definiujące cały model danych systemu zaproszeniowego. Po tym tasku: `npm run typecheck` przechodzi, Payload generuje typy, tabele zostaną utworzone przy starcie dev.

**Files:**
- Create: `platform/src/payload/globals/PlatformSettings.ts`
- Create: `platform/src/payload/collections/WaitlistRequests.ts`
- Create: `platform/src/payload/collections/InvitationTokens.ts`
- Modify: `platform/payload.config.ts`

**Interfaces:**
- Produces: `WaitlistRequest` type (z `payload-types.ts` po `generateTypes`): `{ id: string, name: string, email: string, note?: string, status: 'pending'|'invited'|'rejected', invitedAt?: string }`
- Produces: `InvitationToken` type: `{ id: string, token: string, email: string, waitlistRef: string|WaitlistRequest, status: 'active'|'used'|'expired', expiresAt: string, usedAt?: string }`
- Produces: `PlatformSettings` type: `{ invitationsEnabled: boolean }`

- [ ] **Step 1: Utwórz `PlatformSettings.ts`**

```typescript
// platform/src/payload/globals/PlatformSettings.ts
import type { GlobalConfig } from "payload";

export const PlatformSettings: GlobalConfig = {
  slug: "platform-settings",
  label: "Ustawienia Platformy",
  access: {
    read: ({ req }) => req.user?.role === "superadmin",
    update: ({ req }) => req.user?.role === "superadmin",
  },
  fields: [
    {
      name: "invitationsEnabled",
      type: "checkbox",
      label: "Włącz system zaproszeniowy",
      defaultValue: false,
      admin: {
        description:
          "Gdy włączone: formularz na landing page jest widoczny, /api/waitlist i /api/admin/invite działają.",
      },
    },
  ],
};
```

- [ ] **Step 2: Utwórz `WaitlistRequests.ts`**

```typescript
// platform/src/payload/collections/WaitlistRequests.ts
import type { CollectionConfig } from "payload";
import { Resend } from "resend";

export const WaitlistRequests: CollectionConfig = {
  slug: "waitlist-requests",
  labels: { singular: "Zgłoszenie", plural: "Zgłoszenia (Waitlist)" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "status", "createdAt"],
    components: {
      afterFields: [
        "/src/payload/components/SendInviteButton#SendInviteButton",
      ],
    },
  },
  access: {
    create: () => true,
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
        const resend = new Resend(process.env.RESEND_API_KEY);
        const adminEmail =
          process.env.SUPERADMIN_EMAIL ?? "biuro@korp-cbm.com";
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
```

- [ ] **Step 3: Utwórz `InvitationTokens.ts`**

```typescript
// platform/src/payload/collections/InvitationTokens.ts
import type { CollectionConfig } from "payload";

export const InvitationTokens: CollectionConfig = {
  slug: "invitation-tokens",
  labels: { singular: "Token zaproszeniowy", plural: "Tokeny zaproszeniowe" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "status", "expiresAt", "usedAt"],
    description:
      "Tokeny są tworzone automatycznie przez /api/admin/invite. W DB przechowywany jest SHA-256 hash tokenu — raw token wysyłany jest tylko emailem.",
  },
  access: {
    create: () => false,
    read: ({ req }) => req.user?.role === "superadmin",
    update: ({ req }) => req.user?.role === "superadmin",
    delete: ({ req }) => req.user?.role === "superadmin",
  },
  fields: [
    {
      name: "token",
      type: "text",
      label: "Token (SHA-256 hash)",
      required: true,
      unique: true,
      admin: { readOnly: true },
    },
    {
      name: "waitlistRef",
      type: "relationship",
      relationTo: "waitlist-requests",
      label: "Zgłoszenie waitlist",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "email",
      type: "email",
      label: "Email zapraszanego",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Aktywny", value: "active" },
        { label: "Użyty", value: "used" },
        { label: "Wygasły", value: "expired" },
      ],
    },
    {
      name: "expiresAt",
      type: "date",
      label: "Wygasa o",
      required: true,
      admin: { readOnly: true },
    },
    {
      name: "usedAt",
      type: "date",
      label: "Użyty o",
      admin: { readOnly: true },
    },
  ],
};
```

- [ ] **Step 4: Zaktualizuj `payload.config.ts`** — dodaj globals i nowe collections

```typescript
// platform/payload.config.ts — zmodyfikowane linie (dodaj importy i wpisy)
// Dodaj importy (po istniejących):
import { WaitlistRequests } from "@/payload/collections/WaitlistRequests";
import { InvitationTokens } from "@/payload/collections/InvitationTokens";
import { PlatformSettings } from "@/payload/globals/PlatformSettings";

// Zmień linię z collections:
collections: [Users, Portfolios, Blocks, Media, Todos, WaitlistRequests, InvitationTokens],

// Dodaj pole globals (po collections):
globals: [PlatformSettings],
```

Pełna zmodyfikowana zawartość `payload.config.ts`:

```typescript
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { Users } from "@/payload/collections/Users";
import { Portfolios } from "@/payload/collections/Portfolios";
import { Blocks } from "@/payload/collections/Blocks";
import { Media } from "@/payload/collections/Media";
import { Todos } from "@/payload/collections/Todos";
import { WaitlistRequests } from "@/payload/collections/WaitlistRequests";
import { InvitationTokens } from "@/payload/collections/InvitationTokens";
import { PlatformSettings } from "@/payload/globals/PlatformSettings";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "/src/payload/components/Logo#AdminLogo",
        Icon: "/src/payload/components/Logo#AdminIcon",
      },
    },
    meta: {
      titleSuffix: " — PortfolioHub",
    },
  },
  collections: [Users, Portfolios, Blocks, Media, Todos, WaitlistRequests, InvitationTokens],
  globals: [PlatformSettings],
  editor: lexicalEditor(),
  secret: (() => {
    if (!process.env.PAYLOAD_SECRET) throw new Error("Missing PAYLOAD_SECRET env var");
    return process.env.PAYLOAD_SECRET;
  })(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: (() => {
        if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL env var");
        return process.env.DATABASE_URL;
      })(),
    },
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
  localization: {
    locales: [
      { label: "Polski", code: "pl" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "pl",
    fallback: true,
  },
  upload: {
    limits: {
      fileSize: 10_000_000,
    },
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: "media",
          generateFileURL: ({ filename: fname, prefix }) =>
            `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${prefix}/${fname}`,
        },
      },
      bucket: process.env.R2_BUCKET_NAME!,
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
        region: "auto",
        endpoint: process.env.R2_ENDPOINT,
      },
    }),
  ],
});
```

- [ ] **Step 5: Dodaj nowe env vars do `.env.example`**

Dodaj na końcu pliku `platform/.env.example`:

```
# === SYSTEM ZAPROSZENIOWY ===
# Email superadmina — docelowy adres notyfikacji o nowych zgłoszeniach waitlist
SUPERADMIN_EMAIL=biuro@korp-cbm.com
# Secret dla GitHub Actions cron (expire-tokens) — wygeneruj: openssl rand -hex 32
CRON_SECRET=change-to-random-hex-32-chars
```

- [ ] **Step 6: Uruchom typecheck**

```bash
cd platform && npm run typecheck
```

Oczekiwany output: zero błędów TypeScript. Jeśli błędy dotyczą `SendInviteButton` (jeszcze nie istnieje) — w `WaitlistRequests.ts` tymczasowo usuń linię `afterFields` i dodaj ją z powrotem w Task 4.

- [ ] **Step 7: Commit**

```bash
git add platform/src/payload/globals/PlatformSettings.ts \
        platform/src/payload/collections/WaitlistRequests.ts \
        platform/src/payload/collections/InvitationTokens.ts \
        platform/payload.config.ts \
        platform/.env.example
git commit -m "feat(payload): INV-01/02 WaitlistRequests + InvitationTokens collections + PlatformSettings global"
```

---

## Task 2: Crypto utility + POST /api/waitlist + rozszerzenie rate-limit

**Co budujesz:** Endpoint `/api/waitlist` przyjmujący zgłoszenia z landing page. Zapisuje do WaitlistRequests (hook Payload wyśle email do admina). Chroniony rate limiterem (3/IP/h). SHA-256 utility do użycia w Task 4.

**Files:**
- Create: `platform/src/lib/crypto.ts`
- Modify: `platform/src/lib/rate-limit.ts`
- Create: `platform/src/app/api/waitlist/route.ts`

**Interfaces:**
- Consumes: `getPayload({ config })` z Payload, `checkWaitlistRateLimit(ip)` z rate-limit
- Produces: `hashToken(rawToken: string): string` — SHA-256 hex digest (używane w Task 4)
- Produces: `POST /api/waitlist` → `201 {}` | `400 {error,fields}` | `403 {error}` | `409 {error}` | `429 {error}`

- [ ] **Step 1: Utwórz `platform/src/lib/crypto.ts`**

```typescript
// platform/src/lib/crypto.ts
import { createHash } from "crypto";

export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}
```

- [ ] **Step 2: Dodaj `checkWaitlistRateLimit` do `platform/src/lib/rate-limit.ts`**

Dodaj na końcu istniejącego pliku (po `checkRateLimit`):

```typescript
const WAITLIST_LIMIT = 3;
const WAITLIST_WINDOW_SECONDS = 3600; // 1 godzina

export async function checkWaitlistRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate-limit:waitlist:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WAITLIST_WINDOW_SECONDS);
  }
  return {
    allowed: count <= WAITLIST_LIMIT,
    remaining: Math.max(0, WAITLIST_LIMIT - count),
  };
}
```

- [ ] **Step 3: Utwórz `platform/src/app/api/waitlist/route.ts`**

```typescript
// platform/src/app/api/waitlist/route.ts
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
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      return NextResponse.json({ error: "email_exists" }, { status: 409 });
    }
    logger.error({ err, email }, "Failed to create waitlist request");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  logger.info({ email }, "Waitlist request created");
  return NextResponse.json({ success: true }, { status: 201 });
}
```

- [ ] **Step 4: Uruchom typecheck**

```bash
cd platform && npm run typecheck
```

Oczekiwany output: zero błędów.

- [ ] **Step 5: Commit**

```bash
git add platform/src/lib/crypto.ts \
        platform/src/lib/rate-limit.ts \
        platform/src/app/api/waitlist/route.ts
git commit -m "feat(api): INV-03 POST /api/waitlist — zapis zgłoszenia waitlist + rate limit"
```

---

## Task 3: Landing page — sekcja waitlist + WaitlistForm

**Co budujesz:** Formularz "Dołącz do PortfolioHub" na landing page jako Client Component. LandingPage staje się async i sprawdza `PlatformSettings.invitationsEnabled` — sekcja niewidoczna gdy flaga wyłączona.

**Files:**
- Create: `platform/src/components/landing/WaitlistForm.tsx`
- Modify: `platform/src/components/landing/LandingPage.tsx`

**Interfaces:**
- Consumes: `POST /api/waitlist` z Task 2
- Produces: sekcja `<WaitlistSection>` w LandingPage (render warunkowy)

- [ ] **Step 1: Utwórz `platform/src/components/landing/WaitlistForm.tsx`**

```tsx
// platform/src/components/landing/WaitlistForm.tsx
"use client";
import { useState } from "react";

type FormState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string }
  | { type: "field_errors"; fields: Record<string, string[]> };

export function WaitlistForm() {
  const [state, setState] = useState<FormState>({ type: "idle" });
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ type: "loading" });

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      note: fd.get("note") as string,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        setState({ type: "success" });
        showToast("Dziękujemy! Odezwiemy się wkrótce.");
        return;
      }

      const data = (await res.json()) as {
        error?: string;
        fields?: Record<string, string[]>;
      };

      if (res.status === 400 && data.fields) {
        setState({ type: "field_errors", fields: data.fields });
        return;
      }
      if (res.status === 409) {
        setState({
          type: "field_errors",
          fields: { email: ["Twoje zgłoszenie już istnieje."] },
        });
        return;
      }
      if (res.status === 429) {
        showToast("Zbyt wiele zgłoszeń — spróbuj za godzinę.");
        setState({ type: "idle" });
        return;
      }
      setState({ type: "error", message: "Coś poszło nie tak. Spróbuj ponownie." });
    } catch {
      setState({ type: "error", message: "Błąd połączenia. Spróbuj ponownie." });
    }
  }

  const fieldErrors =
    state.type === "field_errors" ? state.fields : {};

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-lg space-y-4">
        <div>
          <label
            htmlFor="waitlist-name"
            className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
          >
            Imię i nazwisko *
          </label>
          <input
            id="waitlist-name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="Jan Kowalski"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="waitlist-email"
            className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
          >
            Adres email *
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="jan@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="waitlist-note"
            className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
          >
            Notatka{" "}
            <span className="font-normal text-[var(--color-muted)]">(opcjonalne)</span>
          </label>
          <textarea
            id="waitlist-note"
            name="note"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="Czym się zajmujesz? Co chcesz pokazać na portfolio?"
          />
        </div>

        {state.type === "error" && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={state.type === "loading"}
          className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state.type === "loading" ? "Wysyłanie…" : "Wyślij zgłoszenie →"}
        </button>
      </form>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Zaktualizuj `platform/src/components/landing/LandingPage.tsx`**

Zamień całą zawartość pliku:

```tsx
// platform/src/components/landing/LandingPage.tsx
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { WaitlistForm } from "./WaitlistForm";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "korp-cbm.com";

const FEATURES = [
  {
    icon: "🧩",
    title: "Blokowa budowa",
    body: "Hero, O mnie, Doświadczenie, Umiejętności, Edukacja, Kontakt — każdy blok edytowalny w panelu admina bez dotykania kodu.",
  },
  {
    icon: "🎨",
    title: "10 motywów",
    body: "Od klasycznego jasnego przez Earth i Synthwave po Retro Terminal. Motywy przełączają się bez przeładowania strony.",
  },
  {
    icon: "🌐",
    title: "Własna domena",
    body: `Subdomeny (*.${PLATFORM_DOMAIN}) lub własna domena przez rekord CNAME — zero konfiguracji po stronie platformy.`,
  },
  {
    icon: "📬",
    title: "Formularz kontaktowy",
    body: "Walidacja Zod, ochrona rate-limit, wysyłka przez Resend. Gotowe do użycia po podaniu adresu email w adminie.",
  },
];

const EXAMPLES = [
  {
    name: "Radosław Stawiszyński",
    role: "Product Manager / Scrum Master",
    slug: "radek",
  },
  { name: "Miłosz Gawlik", role: "Portfolio IT", slug: "milosz" },
  { name: "Martyna Stawiszyńska", role: "Autorka książek", slug: "martyna" },
];

export async function LandingPage() {
  let invitationsEnabled = false;
  try {
    const payload = await getPayload({ config });
    const settings = await payload.findGlobal({
      slug: "platform-settings",
      overrideAccess: true,
    });
    invitationsEnabled = Boolean(settings.invitationsEnabled);
  } catch {
    // Jeśli DB niedostępna lub global jeszcze nie istnieje — ukryj sekcję
    invitationsEnabled = false;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* ── Hero ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Portfolio Platform
        </p>
        <h1 className="text-5xl font-bold leading-tight text-[var(--color-primary)] md:text-7xl">
          Portfolio
          <span className="text-[var(--color-accent)]">Hub</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-[var(--color-muted)] md:text-xl">
          Profesjonalne portfolio dla każdego. Własna domena, edytowalne bloki,
          wiele motywów — gotowe w minuty.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={`https://radek.${PLATFORM_DOMAIN}`}
            className="rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow transition-opacity hover:opacity-90"
          >
            Zobacz przykład →
          </a>
          <Link
            href="/admin"
            className="rounded-full border border-[var(--color-bg-alt)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg-alt)]"
          >
            Panel admina
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-[var(--color-bg-alt)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--color-primary)]">
            Co oferuje platforma?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-[var(--color-bg)] p-6 shadow-sm"
              >
                <div className="mb-3 text-3xl" aria-hidden="true">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Examples ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[var(--color-primary)]">
            Aktywne portfolio
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {EXAMPLES.map((e) => (
              <a
                key={e.slug}
                href={`https://${e.slug}.${PLATFORM_DOMAIN}`}
                className="group rounded-2xl border border-[var(--color-bg-alt)] p-6 transition-colors hover:border-[var(--color-accent)]"
              >
                <div
                  className="mb-3 h-10 w-10 rounded-full bg-[var(--color-accent)] opacity-70 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
                <p className="font-semibold text-[var(--color-primary)]">{e.name}</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{e.role}</p>
                <p className="mt-3 text-sm font-medium text-[var(--color-accent)]">
                  {e.slug}.{PLATFORM_DOMAIN} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist (warunkowo) ── */}
      {invitationsEnabled && (
        <section className="bg-[var(--color-bg-alt)] px-6 py-20">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-[var(--color-primary)]">
              Chcesz własne portfolio?
            </h2>
            <p className="mb-10 text-[var(--color-muted)]">
              Zostaw dane — odezwiemy się z zaproszeniem.
            </p>
            <WaitlistForm />
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-bg-alt)] px-6 py-8 text-center text-sm text-[var(--color-muted)]">
        <p>
          PortfolioHub &copy; {new Date().getFullYear()} &mdash;{" "}
          <Link
            href="/admin"
            className="transition-colors hover:text-[var(--color-accent)]"
          >
            Panel admina
          </Link>
        </p>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Uruchom typecheck**

```bash
cd platform && npm run typecheck
```

Oczekiwany output: zero błędów.

- [ ] **Step 4: Commit**

```bash
git add platform/src/components/landing/WaitlistForm.tsx \
        platform/src/components/landing/LandingPage.tsx
git commit -m "feat(landing): INV-04 formularz 'Dołącz do PortfolioHub' na landing page (warunkowo)"
```

---

## Task 4: POST /api/admin/invite + SendInviteButton

**Co budujesz:** Endpoint wysyłający zaproszenie emailem. Custom Payload component — przycisk "Wyślij zaproszenie" widoczny w widoku edycji zgłoszenia waitlist.

**Files:**
- Create: `platform/src/app/api/admin/invite/route.ts`
- Create: `platform/src/payload/components/SendInviteButton.tsx`

**Interfaces:**
- Consumes: `hashToken(rawToken)` z `@/lib/crypto` (Task 2)
- Consumes: `POST /api/admin/invite { waitlistId: string }` → `200 {}` | `400` | `403` | `409` | `500`
- Produces: `SendInviteButton` — Client Component dla Payload admin

- [ ] **Step 1: Utwórz `platform/src/app/api/admin/invite/route.ts`**

```typescript
// platform/src/app/api/admin/invite/route.ts
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
        `Cześć ${waitlistRequest.name},`,
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
```

- [ ] **Step 2: Utwórz `platform/src/payload/components/SendInviteButton.tsx`**

```tsx
// platform/src/payload/components/SendInviteButton.tsx
"use client";
import { useDocumentInfo } from "@payloadcms/ui";
import { useState } from "react";

export function SendInviteButton() {
  const { id, savedDocumentData } = useDocumentInfo();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const currentStatus = (savedDocumentData as { status?: string } | undefined)
    ?.status;

  if (currentStatus !== "pending") return null;

  async function handleClick() {
    if (!id) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waitlistId: String(id) }),
      });
      if (res.ok) {
        setStatus("done");
        setMessage("Zaproszenie wysłane! Odśwież stronę, aby zobaczyć zaktualizowany status.");
      } else {
        const data = (await res.json()) as { error?: string };
        setStatus("error");
        setMessage(
          data.error === "invitations_disabled"
            ? "System zaproszeniowy jest wyłączony w Ustawieniach Platformy."
            : data.error === "already_processed"
            ? "To zgłoszenie zostało już przetworzone."
            : `Błąd: ${data.error ?? "nieznany"}`
        );
      }
    } catch {
      setStatus("error");
      setMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  }

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "0.5rem",
        background: "var(--theme-elevation-50)",
      }}
    >
      <p style={{ marginBottom: "1rem", fontWeight: 600 }}>Wyślij zaproszenie</p>
      {status === "done" || status === "error" ? (
        <p style={{ color: status === "done" ? "green" : "red" }}>{message}</p>
      ) : (
        <button
          onClick={handleClick}
          disabled={status === "loading"}
          style={{
            padding: "0.5rem 1.5rem",
            background: "var(--theme-success-500, #16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.7 : 1,
          }}
        >
          {status === "loading" ? "Wysyłanie…" : "Wyślij zaproszenie →"}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Uruchom typecheck**

```bash
cd platform && npm run typecheck
```

Oczekiwany output: zero błędów.

- [ ] **Step 4: Commit**

```bash
git add platform/src/app/api/admin/invite/route.ts \
        platform/src/payload/components/SendInviteButton.tsx
git commit -m "feat(api+admin): INV-05/06 POST /api/admin/invite + SendInviteButton w Payload admin"
```

---

## Task 5: /join page + placeholder blocks + middleware

**Co budujesz:** Strona rejestracji przez token zaproszeniowy. Walidacja tokenu server-side, formularz (subdomena + hasło), tworzenie User + Portfolio z blokami placeholder.

**Files:**
- Create: `platform/src/lib/placeholder-blocks.ts`
- Create: `platform/src/app/(portfolio)/join/page.tsx`
- Modify: `platform/src/middleware.ts`

**Interfaces:**
- Consumes: `hashToken(rawToken)` z `@/lib/crypto`
- Consumes: kolekcje `invitation-tokens`, `users`, `portfolios`, `blocks` przez Payload
- Produces: `createPlaceholderBlocks(portfolioId: string, email: string): BlockData[]`

- [ ] **Step 1: Dodaj "join" do RESERVED w `platform/src/middleware.ts`**

Znajdź linię:
```typescript
const RESERVED = new Set(["www", "admin", "api"]);
```
Zmień na:
```typescript
const RESERVED = new Set(["www", "admin", "api", "join"]);
```

- [ ] **Step 2: Utwórz `platform/src/lib/placeholder-blocks.ts`**

```typescript
// platform/src/lib/placeholder-blocks.ts

type BlockData = {
  portfolio: string;
  type: string;
  order: number;
  visible: boolean;
  [key: string]: unknown;
};

export function createPlaceholderBlocks(portfolioId: string, email: string): BlockData[] {
  return [
    {
      portfolio: portfolioId,
      type: "hero",
      order: 10,
      visible: true,
      heroData: {
        title: "Imię Nazwisko",
        subtitle: "Twoje stanowisko",
      },
    },
    {
      portfolio: portfolioId,
      type: "about",
      order: 20,
      visible: true,
      aboutData: {
        bio: "Napisz tutaj kilka zdań o sobie. Kim jesteś, co robisz, co Cię wyróżnia.",
      },
    },
    {
      portfolio: portfolioId,
      type: "experience",
      order: 30,
      visible: true,
      experienceData: {
        items: [
          {
            company: "Twoja firma",
            role: "Twoje stanowisko",
            startDate: "2020-01",
            description: "Opisz swoje obowiązki i osiągnięcia.",
          },
        ],
      },
    },
    {
      portfolio: portfolioId,
      type: "skills",
      order: 40,
      visible: true,
      skillsData: {
        categories: [
          { name: "Umiejętności", skills: "Umiejętność 1\nUmiejętność 2\nUmiejętność 3" },
        ],
      },
    },
    {
      portfolio: portfolioId,
      type: "education",
      order: 50,
      visible: true,
      educationData: {
        items: [
          {
            school: "Twoja uczelnia",
            degree: "Tytuł",
            field: "Kierunek",
            startYear: 2016,
            endYear: 2020,
          },
        ],
      },
    },
    {
      portfolio: portfolioId,
      type: "contact",
      order: 60,
      visible: true,
      contactData: {
        email,
        showForm: true,
      },
    },
  ];
}
```

- [ ] **Step 3: Utwórz `platform/src/app/(portfolio)/join/page.tsx`**

```tsx
// platform/src/app/(portfolio)/join/page.tsx
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

  // Walidacja subdomeny
  if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
    return {
      error: "Subdomena musi mieć 3–30 znaków i zawierać tylko litery a-z, cyfry i myślniki.",
    };
  }

  // Sprawdź unikalność subdomeny
  const existing = await payload.find({
    collection: "portfolios",
    where: { subdomain: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.totalDocs > 0) {
    return { error: "Ta subdomena jest już zajęta — wybierz inną." };
  }

  // Zwaliduj token ponownie (bezpieczeństwo)
  const { status, tokenId, email } = await validateToken(rawToken);
  if (status !== "valid" || !tokenId || !email) {
    return { error: "Token wygasł lub jest nieprawidłowy." };
  }

  // Utwórz usera
  let newUser: { id: string };
  try {
    newUser = await payload.create({
      collection: "users",
      data: { email, password, role: "owner" },
      overrideAccess: true,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("unique") || msg.toLowerCase().includes("duplicate")) {
      return { error: "Konto z tym emailem już istnieje. Spróbuj się zalogować." };
    }
    logger.error({ err }, "Failed to create user on /join");
    return { error: "Błąd serwera podczas tworzenia konta." };
  }

  // Utwórz portfolio
  const portfolio = await payload.create({
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
  });

  // Utwórz bloki placeholder
  const blocks = createPlaceholderBlocks(String(portfolio.id), email);
  for (const block of blocks) {
    await payload.create({
      collection: "blocks",
      data: block,
      overrideAccess: true,
    });
  }

  // Oznacz token jako użyty
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
  const headersList = await headers();
  const portfolioSlug = headersList.get("x-portfolio-slug");

  // Jeśli otwarte z subdomeny portfolio → redirect na główną domenę
  if (portfolioSlug) {
    redirect(`https://${PLATFORM_DOMAIN}/join`);
  }

  const params = await searchParams;
  const rawToken = params.token ?? "";

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
    const messages: Record<Exclude<TokenStatus, "valid" | "missing">, string> = {
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
```

- [ ] **Step 4: Utwórz `platform/src/components/join/JoinForm.tsx`**

```tsx
// platform/src/components/join/JoinForm.tsx
"use client";
import { useActionState } from "react";

type FormResult = { error?: string } | undefined;

interface JoinFormProps {
  action: (subdomain: string, password: string) => Promise<FormResult>;
  platformDomain: string;
}

export function JoinForm({ action, platformDomain }: JoinFormProps) {
  const [state, formAction, isPending] = useActionState<FormResult, FormData>(
    async (_prev: FormResult, formData: FormData) => {
      const subdomain = (formData.get("subdomain") as string) ?? "";
      const password = (formData.get("password") as string) ?? "";
      const confirmPassword = (formData.get("confirmPassword") as string) ?? "";

      if (password !== confirmPassword) {
        return { error: "Hasła nie są zgodne." };
      }
      if (password.length < 8) {
        return { error: "Hasło musi mieć co najmniej 8 znaków." };
      }

      return action(subdomain, password);
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="subdomain"
          className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
        >
          Subdomena *
        </label>
        <div className="flex items-center gap-2">
          <input
            id="subdomain"
            name="subdomain"
            type="text"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9-]+"
            className="flex-1 rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="jan"
          />
          <span className="shrink-0 text-sm text-[var(--color-muted)]">
            .{platformDomain}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Tylko litery a-z, cyfry i myślniki (3–30 znaków).
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
        >
          Hasło *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
        >
          Potwierdź hasło *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Tworzenie konta…" : "Utwórz konto →"}
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Uruchom typecheck**

```bash
cd platform && npm run typecheck
```

Oczekiwany output: zero błędów.

- [ ] **Step 6: Commit**

```bash
git add platform/src/lib/placeholder-blocks.ts \
        platform/src/app/\(portfolio\)/join/page.tsx \
        platform/src/components/join/JoinForm.tsx \
        platform/src/middleware.ts
git commit -m "feat(join): INV-07 strona /join — walidacja tokenu, rejestracja, portfolio placeholder"
```

---

## Task 6: /api/cron/expire-tokens + GitHub Actions workflow

**Co budujesz:** Endpoint do wygaszania tokenów po 48h, wywoływany przez GitHub Actions cron każdej nocy. Chroniony `CRON_SECRET`.

**Files:**
- Create: `platform/src/app/api/cron/expire-tokens/route.ts`
- Create: `.github/workflows/expire-tokens.yml`

**Interfaces:**
- Consumes: `GET /api/cron/expire-tokens` z nagłówkiem `Authorization: Bearer CRON_SECRET`
- Produces: `200 { expired: number }` | `401 { error }` | `500 { error }`

- [ ] **Step 1: Utwórz `platform/src/app/api/cron/expire-tokens/route.ts`**

```typescript
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
    await payload.update({
      collection: "invitation-tokens",
      id: String(token.id),
      data: { status: "expired" },
      overrideAccess: true,
    });
    count++;
  }

  logger.info({ count }, "Expired invitation tokens marked");
  return NextResponse.json({ expired: count }, { status: 200 });
}
```

- [ ] **Step 2: Utwórz `.github/workflows/expire-tokens.yml`**

```yaml
# .github/workflows/expire-tokens.yml
name: Expire Invitation Tokens

on:
  schedule:
    - cron: '0 0 * * *'   # codziennie 00:00 UTC
  workflow_dispatch:        # możliwość ręcznego uruchomienia z zakładki Actions

jobs:
  expire:
    runs-on: ubuntu-latest
    steps:
      - name: Expire tokens via API
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" \
            -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://korp-cbm.com/api/cron/expire-tokens)
          echo "HTTP status: $response"
          if [ "$response" != "200" ]; then
            echo "ERROR: Unexpected HTTP status $response"
            exit 1
          fi
```

**Jak skonfigurować CRON_SECRET:**
1. Wygeneruj secret: `openssl rand -hex 32`
2. GitHub repo → Settings → Secrets and variables → Actions → New repository secret → nazwa: `CRON_SECRET`, wartość: wygenerowany hex
3. Vercel → projekt → Settings → Environment Variables → dodaj `CRON_SECRET` (Production + Preview + Development)
4. Lokalnie: dodaj do `platform/.env.local`

- [ ] **Step 3: Uruchom typecheck**

```bash
cd platform && npm run typecheck
```

Oczekiwany output: zero błędów.

- [ ] **Step 4: Commit**

```bash
git add platform/src/app/api/cron/expire-tokens/route.ts \
        .github/workflows/expire-tokens.yml
git commit -m "feat(cron): INV-08 /api/cron/expire-tokens + GitHub Actions workflow (daily 00:00 UTC)"
```

---

## Task 7: Finalizacja — PLAN.md + CHANGELOG + weryfikacja

**Co budujesz:** Zaznaczenie tasków jako ukończonych w PLAN.md, wpis w CHANGELOG.md, weryfikacja całego flow ręcznie w przeglądarce.

**Files:**
- Modify: `PLAN.md` — zaznacz INV-01–INV-09, B8.11, F9.16, A10.10 jako `[x]`
- Modify: `CHANGELOG.md` — dodaj wpis v2.7

**Jak przetestować cały flow manualnie:**

```bash
cd platform
docker compose -f docker-compose.dev.yml up -d
npm run dev
```

Kolejność testów:

1. **Włącz zaproszenia:** wejdź na `http://localhost:3000/admin` → Globals → Ustawienia Platformy → ustaw `invitationsEnabled = true` → zapisz

2. **Sprawdź landing page:** wejdź na `http://localhost:3000` — powinna pojawić się sekcja "Chcesz własne portfolio?" z formularzem

3. **Wyślij zgłoszenie waitlist:** wypełnij formularz z testowym emailem → sprawdź czy toast się pojawia

4. **Sprawdź zgłoszenie w adminie:** `http://localhost:3000/admin/collections/waitlist-requests` — powinno być widoczne nowe zgłoszenie ze statusem "pending" + przycisk "Wyślij zaproszenie"

5. **Wyślij zaproszenie:** kliknij przycisk "Wyślij zaproszenie" w widoku zgłoszenia → sprawdź czy status zmienił się na "invited"

6. **Sprawdź token:** `http://localhost:3000/admin/collections/invitation-tokens` — powinien być nowy token ze statusem "active"

7. **Strona /join bez tokenu:** wejdź na `http://localhost:3000/join` — powinna pokazać komunikat "Wymagane zaproszenie"

8. **Strona /join z tokenem:** w adminie skopiuj ID tokenu, wejdź na `http://localhost:3000/join?token=NIEPRAWIDLOWY_UUID` — komunikat "Nieprawidłowy link"

9. **Testowy /join z prawidłowym tokenem:** aby przetestować pełny flow bez emaila, utwórz token manualnie w adminie (lub użyj debuggera) albo sprawdź logi dev serwera gdzie token jest logowany

10. **Cron endpoint:** `curl -H "Authorization: Bearer twój_CRON_SECRET" http://localhost:3000/api/cron/expire-tokens` → powinno zwrócić `{"expired": 0}` (lub liczbę wygasłych)

- [ ] **Step 1: Zaktualizuj PLAN.md**

W sekcji §25 (INV tasks) zaznacz jako ukończone:
```
- [x] **INV-01** Kolekcja `WaitlistRequests` (2026-07-07, Agent: Claude)
- [x] **INV-02** Kolekcja `InvitationTokens` (2026-07-07, Agent: Claude)
- [x] **INV-03** `POST /api/waitlist` (2026-07-07, Agent: Claude)
- [x] **INV-04** Sekcja "Dołącz do PortfolioHub" na landing page (2026-07-07, Agent: Claude)
- [x] **INV-05** `POST /api/admin/invite` (2026-07-07, Agent: Claude)
- [x] **INV-06** Przycisk "Wyślij zaproszenie" w Payload admin (2026-07-07, Agent: Claude)
- [x] **INV-07** Strona `/join?token=XYZ` (2026-07-07, Agent: Claude)
- [x] **INV-08** Cron job GitHub Actions (2026-07-07, Agent: Claude)
```

Zaznacz też powiązane:
```
- [x] **B8.11** Kolekcja WaitlistRequests (2026-07-07, Agent: Claude)
- [x] **F9.16** Formularz "Dołącz do PortfolioHub" na landing page (2026-07-07, Agent: Claude)
- [x] **A10.10** Panel zaproszeń w adminie (2026-07-07, Agent: Claude)
```

- [ ] **Step 2: Dodaj wpis do CHANGELOG.md**

```markdown
## [2026-07-07] v2.7 — System zaproszeniowy (INV-01–INV-08)

### Added
- `PlatformSettings` Global w Payload — feature flag `invitationsEnabled` (domyślnie wyłączony)
- Kolekcja `WaitlistRequests` — zgłoszenia z landing page, hook afterChange → email do superadmina
- Kolekcja `InvitationTokens` — SHA-256 hash tokenów, TTL 48h, statusy active/used/expired
- `POST /api/waitlist` — przyjmuje zgłoszenia, rate limit 3/IP/h, sprawdza flagę
- `POST /api/admin/invite` — generuje UUID token → SHA-256 hash → email zaproszeniowy Resend
- `SendInviteButton` — custom Payload component w widoku WaitlistRequest
- `GET /api/cron/expire-tokens` — wygasza aktywne tokeny po 48h, chroniony CRON_SECRET
- GitHub Actions workflow `expire-tokens.yml` — cron codziennie 00:00 UTC
- Strona `/join?token=UUID` — walidacja tokenu, rejestracja użytkownika + portfolio z placeholderami
- Landing page: sekcja "Chcesz własne portfolio?" widoczna gdy invitationsEnabled=true
- `createPlaceholderBlocks()` — 6 bloków placeholder dla nowego portfolio (hero, about, experience, skills, education, contact)
- Nowe env vars: `CRON_SECRET`, `SUPERADMIN_EMAIL`
```

- [ ] **Step 3: Commit finalny**

```bash
git add PLAN.md CHANGELOG.md
git commit -m "docs(plan+changelog): v2.7 — system zaproszeniowy INV-01–INV-08 ukończony"
```

---

## Self-Review checklist

| Wymaganie ze spec | Task |
|-------------------|------|
| PlatformSettings global z invitationsEnabled | Task 1 |
| WaitlistRequests kolekcja (pola, access, hook email) | Task 1 |
| InvitationTokens kolekcja (SHA-256, TTL, statusy) | Task 1 |
| POST /api/waitlist — zapis + rate limit + flag check | Task 2 |
| SHA-256 hash utility | Task 2 |
| Rate limit 3/IP/h dla waitlist (osobny od contact) | Task 2 |
| WaitlistForm Client Component z toastem | Task 3 |
| LandingPage async — sekcja warunkowa | Task 3 |
| POST /api/admin/invite — token + email + status update | Task 4 |
| SendInviteButton w Payload admin | Task 4 |
| /join — brak tokenu → komunikat | Task 5 |
| /join — invalid/expired/used → komunikat | Task 5 |
| /join — subdomena on-submit validation | Task 5 |
| /join — tworzenie User + Portfolio + bloków | Task 5 |
| createPlaceholderBlocks() — 6 bloków | Task 5 |
| "join" w RESERVED middleware | Task 5 |
| /api/cron/expire-tokens z auth | Task 6 |
| GitHub Actions workflow (daily 00:00 UTC) | Task 6 |
| PLAN.md + CHANGELOG zaktualizowane | Task 7 |
| env vars w .env.example | Task 1 |

**INV-09** (widok InvitationTokens w adminie z ręcznym unieważnieniem) — obsługiwany przez standardowy Payload admin z kolekcji `InvitationTokens` (Task 1). Pole `status` jest edytowalne przez superadmina — zmiana na `expired` = ręczne unieważnienie. Nie wymaga dodatkowego kodu.
