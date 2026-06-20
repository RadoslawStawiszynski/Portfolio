# Dostępy i serwisy — PortfolioHub

> Ten plik opisuje JAKIE dostępy istnieją i GDZIE znaleźć klucze.
> Rzeczywiste klucze/tokeny są WYŁĄCZNIE w `.env.local` (nigdy w repo).
> Czytaj ten plik na początku każdej sesji razem z `.env.local`.

## Jak zacząć sesję (dla agenta AI)

```
1. Przeczytaj: /home/rspro/Dokumenty/1.CODE/2.Portfolio/.env.local
2. Przeczytaj: /home/rspro/Dokumenty/1.CODE/2.Portfolio/docs/access.md
3. Przeczytaj: PLAN.md §2 (ADR) + aktywna faza
4. Sprawdź: git branch (powinno być `dev`)
```

## Serwisy i ich status

| Serwis | Status | Zmienna w .env.local | Uwagi |
|--------|--------|----------------------|-------|
| **Neon PostgreSQL** | ✅ aktywny | `DATABASE_URL` | eu-central-1, pooler URL |
| **Upstash Redis** | ✅ aktywny | `UPSTASH_REDIS_REST_URL` + `TOKEN` | eu-west-1, free tier |
| **Cloudflare R2** | ✅ aktywny | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` | bucket: portfoliohub, EEUR |
| **Resend** | ✅ aktywny, domena zweryfikowana | `RESEND_API_KEY` | korp-cbm.com zweryfikowany, eu-west-1 |
| **Vercel** | ✅ projekt portfolio połączony | CLI zalogowany | auto-deploy OFF, root=platform |
| **Cloudflare DNS** | ✅ aktywny | `CLOUDFLARE_API_TOKEN` | korp-cbm.com, DNS:Edit na strefie |
| **GitHub** | ✅ SSH | brak tokena — SSH key | repo: RadoslawStawiszynski/Portfolio |

## Cloudflare DNS — aktualny stan (po H13.7 poprawione 2026-06-18)

```
korp-cbm.com       CNAME → cname.vercel-dns.com  (proxied 🟠)
*.korp-cbm.com     CNAME → cname.vercel-dns.com  (proxied 🟠)
```

SSL/TLS mode w Cloudflare: Full
(NIE Strict — Cloudflare terminuje SSL, Vercel serwuje Next.js za proxy)

Weryfikacja: dig korp-cbm.com → 104.21.22.126 / 172.67.205.8 (Cloudflare Anycast) ✅
SSL: TLS 1.3, cert *.korp-cbm.com (Google Trust Services, ważny do 2026-08-16) ✅

Zachowane (nie ruszać bez decyzji Radosława):
- NS → dns.home.pl / dns2.home.pl / dns3.home.pl (Radosław korzysta)
- MX → post.pl (poczta)
- SRV → post.pl (IMAP/POP3/SMTP)
- CNAME distribution.korp-cbm.com → sklep-tom-jur.pages.dev (stary sklep)
- CNAME dystrybucja.korp-cbm.com → sklep-tom-jur.pages.dev (stary sklep)

Usunięte (2026-06-12):
- CNAME prox.korp-cbm.com → cfargotunnel.com (nieużywany tunnel)

## Vercel — zmienne środowiskowe (14 vars, environment: Production)

Ustawione: DATABASE_URL, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN,
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_ENDPOINT,
RESEND_API_KEY, RESEND_FROM_EMAIL, PAYLOAD_SECRET,
NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_PLATFORM_DOMAIN, LOG_LEVEL

## Domeny dodane w Vercel

- `korp-cbm.com` ✅
- `*.korp-cbm.com` ✅

## Stan produkcji (2026-06-20)

- `korp-cbm.com` → 200 ✅ (Landing Page — PortfolioHub)
- `korp-cbm.com/admin` → 200 ✅ (Payload CMS Dashboard)
- `www.korp-cbm.com` → 200 ✅
- `radek.korp-cbm.com` → 404 (oczekiwane — brak portfolio `radek` w DB)

## Co NIE jest jeszcze zrobione

- H13.11: UptimeRobot monitoring
- Faza 4: stworzenie konta admina + dodanie portfeli (radek, milosz, martyna, cbm)
