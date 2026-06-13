# Design Spec — B8.5: Contact Form API Endpoint

**Data:** 2026-06-13
**Task:** B8.5 — API endpoint formularz kontaktowy z rate limitingiem Redis
**Branch:** dev
**Status:** Approved

---

## Cel

Endpoint `POST /api/contact` umożliwiający odwiedzającym portfolio wysłanie wiadomości do właściciela. Zabezpieczony rate limitingiem Redis (Upstash) i walidacją Zod. Email wysyłany przez Resend.

---

## Architektura

### Nowe pliki

```
platform/src/
  app/api/contact/route.ts          ← Route Handler — główna logika
  lib/redis.ts                      ← singleton @upstash/redis
  lib/rate-limit.ts                 ← helper: sprawdź + inkrementuj licznik
```

### Zmienione pliki

```
platform/src/payload/collections/Portfolios.ts  ← dodać pole contactEmail
```

### Nowe zależności npm

```
resend             — wysyłka emaili
@upstash/redis     — Redis REST client (kompatybilny z Vercel Edge/Serverless)
zod                — walidacja schematu requestu
```

---

## Zod Schema

```typescript
const ContactSchema = z.object({
  portfolioSlug: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});
```

---

## Rate Limiting

- **Strategia:** INCR + EXPIRE w Redis
- **Klucz:** `rate-limit:contact:{ip}`
- **Limit:** 3 requesty / 15 minut (900 sekund) per IP
- **IP źródło:** nagłówek `x-forwarded-for` (Vercel ustawia automatycznie)
- **Brak biblioteki rate-limit** — prosty helper w `lib/rate-limit.ts`

```typescript
// lib/rate-limit.ts
export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate-limit:contact:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 900);
  return { allowed: count <= 3, remaining: Math.max(0, 3 - count) };
}
```

---

## Data Flow

```
POST /api/contact { portfolioSlug, name, email, message }
  │
  ├─ 1. Zod validate body
  │       └─ błąd → 400 { error: "validation", fields: {...} }
  │
  ├─ 2. Pobierz IP z x-forwarded-for (fallback: "unknown")
  │
  ├─ 3. Redis: checkRateLimit(ip)
  │       └─ przekroczony → 429 + Retry-After: 900
  │
  ├─ 4. Payload getPayload() → db.find({ collection: "portfolios", where: { subdomain: { equals: portfolioSlug } } })
  │       └─ brak → 404 { error: "portfolio_not_found" }
  │
  ├─ 5. Resend: sendEmail()
  │       To: portfolio.contactEmail || "biuro@korp-cbm.com"
  │       From: process.env.RESEND_FROM_EMAIL
  │       Subject: `Nowa wiadomość z portfolio ${portfolioSlug}`
  │       Text: `Imię: ${name}\nEmail: ${email}\n\n${message}`
  │       └─ błąd → 500 { error: "email_failed" } + logger.error
  │
  └─ 6. return 200 { success: true }
```

---

## Zmiana w kolekcji Portfolios

```typescript
{
  name: "contactEmail",
  type: "email",
  defaultValue: "biuro@korp-cbm.com",
  admin: {
    description: "Email do odbierania wiadomości z formularza kontaktowego. Edytowalny w panelu admina.",
  },
},
```

Pole opcjonalne — jeśli puste, fallback do `"biuro@korp-cbm.com"`.

---

## HTTP Responses

| Status | Kiedy | Body |
|--------|-------|------|
| `200` | Email wysłany | `{ success: true }` |
| `400` | Błąd walidacji Zod | `{ error: "validation", fields: {...} }` |
| `404` | Nieznany portfolioSlug | `{ error: "portfolio_not_found" }` |
| `429` | Rate limit przekroczony | `{ error: "rate_limit_exceeded" }` + `Retry-After: 900` |
| `500` | Błąd Resend / DB | `{ error: "internal_error" }` |

---

## Środowisko / ENV

Zmienne już skonfigurowane w `.env.local` i Vercel:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (noreply@korp-cbm.com)

---

## Co NIE wchodzi w scope (backlog)

- Honeypot / CAPTCHA (można dodać w Fazie 3)
- Zapis wiadomości do bazy (A10.13 — skrzynka wiadomości)
- Potwierdzenie email do nadawcy
- Walidacja domeny email (MX check)
