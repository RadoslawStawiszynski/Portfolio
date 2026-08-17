# System Zaproszeniowy + Landing Page — Design Spec

**Data:** 2026-07-07  
**Status:** Approved  
**Dotyczy:** PortfolioHub — INV-01–INV-09, B8.11, F9.16, A10.10  
**Autorzy:** Radosław Stawiszyński + Claude

---

## 1. Cel

Umożliwienie zainteresowanym osobom zgłoszenia chęci posiadania portfolio poprzez formularz na landing page. Superadmin wysyła zaproszenie jednym kliknięciem. Zaproszony rejestruje konto i dostaje puste (ale wypełnione placeholderami) portfolio gotowe do edycji.

Cały system jest domyślnie **wyłączony** — włączany flagą w panelu superadmina.

---

## 2. Architektura ogólna

Podejście: **Payload-native** — obie kolekcje jako Payload Collections, logika w hookach i Next.js API routes, admin UI gratis.

```
Landing Page (warunkowo)
    └── Formularz "Dołącz" → Server Action → WaitlistRequests + email do admina

Payload Admin
    └── WaitlistRequests list → przycisk "Wyślij zaproszenie" → /api/admin/invite
        └── InvitationTokens → email do zainteresowanego z /join?token=UUID

/join?token=UUID
    └── Walidacja tokenu → formularz (subdomena + hasło) → User + Portfolio + bloki placeholder

GitHub Actions (cron daily)
    └── /api/cron/expire-tokens → oznacza wygasłe tokeny
```

---

## 3. Dane

### 3.1 Global: `PlatformSettings`

Jeden rekord w systemie. Superadmin-only access.

| Pole | Typ | Opis |
|------|-----|------|
| `invitationsEnabled` | checkbox | Domyślnie `false`. Gdy `false`: formularz na landing page jest ukryty, `/api/waitlist` zwraca 403, przycisk "Wyślij zaproszenie" w adminie jest ukryty. |

**Jak używać:** `/admin/globals/platform-settings` → przełącz `invitationsEnabled` na `true` aby uruchomić pełny flow zaproszeniowy.

### 3.2 Kolekcja: `WaitlistRequests`

Slug: `waitlist-requests`

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `name` | text | tak | Imię i nazwisko zgłaszającego |
| `email` | email | tak, unikalne | Adres email — używany jako login przy rejestracji |
| `note` | textarea | nie | Opcjonalna notka dla admina |
| `status` | select | tak | `pending` / `invited` / `rejected` (default: `pending`) |
| `createdAt` | date | auto | Data zgłoszenia |
| `invitedAt` | date | nie | Ustawiane automatycznie przy wysłaniu zaproszenia |

**Access:**
- `create`: public (formularz landing page)
- `read`, `update`, `delete`: superadmin only

**Hook `afterCreate`:** wysyła email Resend na adres superadmina z informacją o nowym zgłoszeniu i przyciskiem "Wyślij zaproszenie" (link do `/admin/collections/waitlist-requests/{id}`).

**Walidacja email:** jeśli email już istnieje w kolekcji → Payload zwróci błąd unikalności → API route przekształca go na przyjazny komunikat dla użytkownika ("Twoje zgłoszenie już istnieje").

### 3.3 Kolekcja: `InvitationTokens`

Slug: `invitation-tokens`

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `token` | text | tak, unikalne | SHA-256 hash z UUID v4 (raw UUID jest wysyłany w emailu, nigdy nie trafia do DB) |
| `waitlistRef` | relation → WaitlistRequests | tak | Powiązane zgłoszenie |
| `email` | email | tak | Denormalizowany email (dla szybkiego lookup przy `/join`) |
| `status` | select | tak | `active` / `used` / `expired` (default: `active`) |
| `expiresAt` | date | tak | `createdAt + 48h` |
| `usedAt` | date | nie | Ustawiane przy wykorzystaniu tokenu |

**Access:** superadmin only (wszystkie operacje). Brak public access.

**Bezpieczeństwo tokenów:**
- Raw UUID v4 generowany w pamięci serwera → wysyłany w emailu → nigdy nie zapisywany do DB
- W DB zapisywany `SHA-256(rawUUID)` — nawet przy wycieku DB tokeny są bezużyteczne
- Lookup przy `/join`: `SHA-256(token_z_URL)` → szukaj w `InvitationTokens.token`

---

## 4. API Routes

### 4.1 `POST /api/waitlist`

**Dostęp:** public (chroniony rate limiterem)  
**Rate limit:** 3 requesty / IP / godzinę (Redis, `@/lib/rate-limit`)

**Request body:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "note": "Interesuje mnie portfolio dla fotografa" // opcjonalne
}
```

**Flow:**
1. Sprawdź `PlatformSettings.invitationsEnabled` → jeśli `false`, zwróć `403`
2. Walidacja (Zod): `name` wymagane, `email` valid format
3. Sprawdź rate limit → jeśli przekroczony, `429`
4. Utwórz `WaitlistRequest` → Payload hook `afterCreate` wyśle email do superadmina
5. Jeśli email duplikat → `409` z wiadomością "Twoje zgłoszenie już istnieje"
6. Sukces → `201`

**Jak używać:** wywoływany przez Server Action z formularza na landing page. Nie wymaga autoryzacji.

### 4.2 `POST /api/admin/invite`

**Dostęp:** superadmin only (sprawdzany przez Payload session)  
**Wywołanie:** przez custom button w Payload admin UI

**Request body:**
```json
{
  "waitlistId": "abc123"
}
```

**Flow:**
1. Sprawdź `PlatformSettings.invitationsEnabled` → jeśli `false`, zwróć `403`
2. Pobierz `WaitlistRequest` po ID → sprawdź `status === 'pending'`
3. Generuj `rawToken = UUID v4`
4. Oblicz `tokenHash = SHA-256(rawToken)`
5. Zapisz `InvitationToken`: `{ token: tokenHash, email, waitlistRef, status: 'active', expiresAt: now+48h }`
6. Wyślij email Resend do `waitlistRequest.email` z linkiem `https://korp-cbm.com/join?token={rawToken}`
7. Aktualizuj `WaitlistRequest`: `{ status: 'invited', invitedAt: now() }`
8. Zwróć `200`

**Email zaproszeniowy zawiera:**
- Powitanie personalizowane imieniem
- Link `/join?token=...` (ważny 48h)
- Informację co użytkownik dostanie po rejestracji

**Jak używać:** wywoływany tylko przez przycisk "Wyślij zaproszenie" w Payload admin. Nie powinien być wywoływany bezpośrednio.

### 4.3 `GET /api/cron/expire-tokens`

**Dostęp:** wymaga nagłówka `Authorization: Bearer {CRON_SECRET}`  
**Wywołanie:** GitHub Actions cron, codziennie o 00:00 UTC

**Flow:**
1. Sprawdź nagłówek `Authorization` → jeśli brak/błędny, `401`
2. Znajdź wszystkie `InvitationTokens` gdzie `expiresAt < now() AND status = 'active'`
3. Ustaw `status = 'expired'` na wszystkich znalezionych
4. Zwróć `200` z liczbą zaktualizowanych rekordów

**Jak używać:** patrz §7 (GitHub Actions setup).

---

## 5. Strony

### 5.1 Landing Page — sekcja "Dołącz do PortfolioHub"

**Plik:** `platform/src/components/landing/LandingPage.tsx`  
**Pozycja w układzie:** Hero → Features → Examples → **[Dołącz]** → Footer

Sekcja renderowana warunkowo — serwer sprawdza `PlatformSettings.invitationsEnabled` przed renderem. Gdy `false`: sekcja nie istnieje w HTML.

**Formularz (Client Component `WaitlistForm.tsx`):**
- Pola: `name` (wymagane), `email` (wymagane), `note` (opcjonalne, textarea)
- Submit → `POST /api/waitlist`
- Sukces → toast/snackbar w prawym dolnym rogu: "Dziękujemy! Odezwiemy się wkrótce."
- Formularz pozostaje widoczny po wysłaniu (user może poprawić email jeśli się pomylił)
- Błąd duplikatu emaila → inline pod polem email
- Błąd 429 → toast "Zbyt wiele zgłoszeń — spróbuj za godzinę"

### 5.2 Strona `/join`

**Plik:** `platform/src/app/(portfolio)/join/page.tsx`

**Routing:** działa na głównej domenie (`korp-cbm.com/join`) — middleware musi przepuszczać `/join` bez subdomain redirect.

**Scenariusze:**

| Warunek | Co widzi użytkownik |
|---------|---------------------|
| Brak `?token` w URL | Strona z komunikatem: "Ta strona wymaga zaproszenia. Wróć na [stronę główną]." |
| Token nieprawidłowy (nie istnieje w DB) | "Nieprawidłowy link zaproszeniowy." |
| Token wygasły (`status = 'expired'` lub `expiresAt < now()`) | "Link wygasł (ważny 48h). Skontaktuj się z administratorem." |
| Token już użyty (`status = 'used'`) | "Ten link został już wykorzystany." |
| Token OK | Formularz rejestracji |

**Formularz rejestracji:**
- `subdomain`: pole tekstowe z sufiksem `.korp-cbm.com` (min 3, max 30 znaków, tylko `[a-z0-9-]`)
- `password`: min 8 znaków
- `passwordConfirm`: musi pasować
- Submit (Server Action):
  1. Walidacja Zod po stronie serwera
  2. Sprawdź unikalność subdomeny → jeśli zajęta: inline błąd "Ta subdomena jest już zajęta, wybierz inną"
  3. Utwórz `User` (email z tokenu, rola: `owner`)
  4. Utwórz `Portfolio` (subdomain, owner: nowy user) + bloki placeholder (`createPlaceholderBlocks(email)`)
  5. Oznacz `InvitationToken.status = 'used'`, `usedAt = now()`
  6. Redirect → `/admin`

---

## 6. Bloki Placeholder (nowe portfolio)

Funkcja `createPlaceholderBlocks(userEmail: string)` zwraca tablicę bloków do zapisania razem z Portfolio:

| Blok | Placeholder content |
|------|---------------------|
| `hero` | Nagłówek: "Imię Nazwisko", podtytuł: "Twoje stanowisko", opis: "Krótki opis zawodowy — edytuj w panelu admina" |
| `about` | "Napisz tutaj kilka zdań o sobie. Kim jesteś, co robisz, co Cię wyróżnia." |
| `experience` | 1 wpis: firma "Twoja firma", stanowisko "Twoje stanowisko", okres "2020 – teraz" |
| `skills` | 3 przykładowe umiejętności: "Umiejętność 1", "Umiejętność 2", "Umiejętność 3" |
| `education` | 1 wpis: uczelnia "Twoja uczelnia", kierunek "Kierunek", rok "2020" |
| `contact` | Email: z konta użytkownika, pozostałe pola puste |

Motyw: domyślny (`default` — jasny).

---

## 7. GitHub Actions — Cron wygasania tokenów

**Plik:** `.github/workflows/expire-tokens.yml`  
**Schedule:** `0 0 * * *` (codziennie o 00:00 UTC)

**Konfiguracja:**
1. Dodaj secret `CRON_SECRET` w GitHub repo Settings → Secrets → Actions
2. Dodaj `CRON_SECRET` w Vercel environment variables (Production + Preview)
3. Workflow wywołuje `GET https://korp-cbm.com/api/cron/expire-tokens` z nagłówkiem `Authorization: Bearer ${{ secrets.CRON_SECRET }}`

**Przykładowy workflow:**
```yaml
name: Expire Invitation Tokens
on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch: # możliwość ręcznego uruchomienia

jobs:
  expire:
    runs-on: ubuntu-latest
    steps:
      - name: Call expire-tokens endpoint
        run: |
          curl -f -X GET \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            https://korp-cbm.com/api/cron/expire-tokens
```

**Monitoring:** GitHub Actions → zakładka "Actions" → workflow "Expire Invitation Tokens" — historia uruchomień z logami.

---

## 8. Payload Admin — Custom Components

### 8.1 Przycisk "Wyślij zaproszenie" w WaitlistRequests

**Plik:** `platform/src/payload/components/SendInviteButton.tsx` (Client Component)  
**Gdzie widoczny:** kolumna akcji lub sidebar w widoku pojedynczego rekordu `WaitlistRequests`

**Logika przycisku:**
- Widoczny tylko gdy `record.status === 'pending'` AND `invitationsEnabled === true`
- Po kliknięciu: `POST /api/admin/invite { waitlistId: record.id }`
- Sukces: komunikat "Zaproszenie wysłane!" + refresh widoku (status zmieni się na `invited`)
- Błąd: komunikat inline

**Jak dodać do Payload collection:** w `WaitlistRequests.ts` → `admin.components.afterList` lub custom row action.

### 8.2 Widok InvitationTokens (INV-09)

Standardowy Payload admin list view z kolumnami: email, status (color-coded), expiresAt, usedAt.  
Akcja "Unieważnij" → ustawia `status = 'expired'` ręcznie.  
Brak public create — tokeny tworzone tylko przez `/api/admin/invite`.

---

## 9. Bezpieczeństwo — podsumowanie

| Wektor | Zabezpieczenie |
|--------|---------------|
| Spam formularza | Rate limit: 3/IP/h (Redis) |
| Duplikat emaila | Unique constraint na `WaitlistRequests.email` |
| Token brute-force | SHA-256 hash w DB, UUID v4 (2^122 przestrzeń) |
| Token replay | Status `used` po pierwszym użyciu |
| Nieuprawniony cron | `Authorization: Bearer CRON_SECRET` |
| Nieuprawniony invite | Payload session check (superadmin only) |
| System wyłączony | `invitationsEnabled` flag blokuje wszystkie endpointy |

---

## 10. Zmienne środowiskowe

Nowe zmienne do dodania do `platform/.env.local` i Vercel:

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `CRON_SECRET` | Secret dla GitHub Actions cron | losowy UUID v4 |
| `SUPERADMIN_EMAIL` | Email superadmina (notyfikacje o zgłoszeniach) | `biuro@korp-cbm.com` |

`RESEND_API_KEY` i `NEXT_PUBLIC_PLATFORM_DOMAIN` już istnieją w projekcie.

---

## 11. Zależności implementacyjne

```
INV-01 (WaitlistRequests) ──┐
INV-02 (InvitationTokens) ──┼── INV-03 (POST /api/waitlist)
                             ├── INV-04 (Landing page form)
                             ├── INV-05 (POST /api/admin/invite)
                             └── INV-06 (SendInviteButton)
                                  │
                            INV-07 (/join page) ← wymaga INV-02 + INV-05
                            INV-08 (cron)       ← wymaga INV-02
                            INV-09 (admin view) ← wymaga INV-02
```

**Kolejność implementacji:** INV-01 → INV-02 → (INV-03 + INV-04 równolegle) → (INV-05 + INV-06 równolegle) → INV-07 → (INV-08 + INV-09 równolegle)

---

## 12. Dokumentacja dla każdego elementu

### PlatformSettings Global
- **Gdzie:** `/admin/globals/platform-settings`
- **Co robi:** steruje flagami platformy (obecnie tylko `invitationsEnabled`)
- **Jak włączyć zaproszenia:** ustaw `invitationsEnabled = true` → sekcja na landing page staje się widoczna, endpointy zaczynają działać

### WaitlistRequests Collection
- **Gdzie:** `/admin/collections/waitlist-requests`
- **Workflow:** zgłoszenia przychodzą automatycznie z landing page → admin dostaje email → klika "Wyślij zaproszenie" → token tworzony automatycznie
- **Statusy:** `pending` (nowe), `invited` (zaproszenie wysłane), `rejected` (odrzucone ręcznie)

### InvitationTokens Collection
- **Gdzie:** `/admin/collections/invitation-tokens`
- **Tylko do podglądu** — tokeny tworzone przez `/api/admin/invite`, nie przez admin UI
- **Ręczne unieważnienie:** zmień `status` na `expired` w widoku rekordu
- **TTL:** token wygasa automatycznie po 48h (GitHub Actions cron)

### Strona /join
- **URL:** `https://korp-cbm.com/join?token=UUID`
- **Użytkownik dostaje link** w emailu zaproszeniowym — nie trzeba mu niczego tłumaczyć
- **Po rejestracji:** użytkownik trafia do `/admin` swojego portfolio — może od razu edytować bloki

### GitHub Actions Cron
- **Gdzie:** `.github/workflows/expire-tokens.yml`
- **Kiedy uruchamia się:** automatycznie co noc o 00:00 UTC; można też uruchomić ręcznie z zakładki Actions
- **Co robi:** oznacza tokeny starsze niż 48h jako `expired` — nie usuwa ich z DB (historia zostaje)
- **Monitoring:** zakładka Actions w GitHub repo → workflow "Expire Invitation Tokens"
