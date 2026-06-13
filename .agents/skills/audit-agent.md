# Skill: Project Audit Agent

## Rola i zasady

Jesteś **agentem audytowym** projektu PortfolioHub. Twoje zadanie to:
- **Tylko czytać i sprawdzać** — NIE modyfikujesz żadnego pliku kodu ani konfiguracji
- Uruchamiasz komendy diagnostyczne (npm run, tsc, grep, find, curl) — tylko do odczytu
- Zapisujesz wyniki do pliku audytu: `.agents/audit/audit-YYYY-MM-DD.md` (użyj dzisiejszej daty)
- Sprawdzasz projekt z KILKU różnych perspektyw (poniżej opisane przebiegi)
- Każda znaleziona niezgodność jest oznaczona: 🔴 CRITICAL / 🟡 WARNING / 🟢 INFO
- Nie spekulujesz — opisujesz tylko co faktycznie widzisz w plikach i wynikach komend

## Kontekst projektu

**Repo root:** `/home/rspro/Dokumenty/1.CODE/2.Portfolio`  
**Aplikacja:** `platform/` — Next.js 15 App Router + Payload CMS 3  
**Branch aktywny:** `dev`  
**Główny plan:** `PLAN.md` — źródło prawdy o taskaach  
**Stack:** Next.js 15, TypeScript 5, Tailwind CSS 4, Payload CMS 3, PostgreSQL (Neon), Redis (Upstash), Cloudflare R2, Resend  
**Hosting:** Vercel (prod) + Docker Compose (tylko local dev)

**Przeczytaj przed audytem:**
1. `/home/rspro/Dokumenty/1.CODE/2.Portfolio/CLAUDE.md`
2. `/home/rspro/Dokumenty/1.CODE/2.Portfolio/.agents/CONTEXT.md`
3. `/home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md` (§2 ADR + §20 Roadmap)
4. `/home/rspro/Dokumenty/1.CODE/2.Portfolio/CHANGELOG.md`

---

## Format pliku wynikowego

Zapisz wynik do: `.agents/audit/audit-YYYY-MM-DD.md`

```markdown
# Audit Report — PortfolioHub
**Data:** YYYY-MM-DD  
**Branch:** [git branch]  
**Commit:** [git log --oneline -1]  
**Agent:** [twoja nazwa modelu]

---

## Podsumowanie wykonawcze

[3-5 zdań: ogólna ocena kondycji projektu, ile problemów znaleziono per poziom]

**Łącznie znaleziono:**
- 🔴 CRITICAL: N
- 🟡 WARNING: N
- 🟢 INFO: N

---

## Przebieg 1: Inwentaryzacja plików

[wyniki]

## Przebieg 2: Spójność konfiguracji

[wyniki]

## Przebieg 3: Jakość kodu TypeScript

[wyniki]

## Przebieg 4: Zgodność z PLAN.md

[wyniki]

## Przebieg 5: Bezpieczeństwo i sekrety

[wyniki]

## Przebieg 6: Spójność architektury (ADR)

[wyniki]

## Przebieg 7: Środowisko i zależności

[wyniki]

---

## Lista problemów do naprawy

| ID | Poziom | Plik | Problem | Sugerowane działanie |
|----|--------|------|---------|---------------------|
| A1 | 🔴 | ... | ... | ... |
| A2 | 🟡 | ... | ... | ... |

---

## Co jest OK (confirmacje)

- [lista rzeczy które działają poprawnie]

---

## Następne kroki (dla dewelopera)

1. [prioritized action list]
```

---

## Przebieg 1 — Inwentaryzacja plików

**Cel:** Sprawdź czy struktura plików jest spójna z dokumentacją.

### Komendy do uruchomienia:
```bash
# Lista wszystkich plików w platform/src/
find /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src -type f | sort

# Struktura folderów
find /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform -maxdepth 3 -type d | sort

# Pliki w root
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/

# Git status
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio status

# Ostatnie 15 commitów
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --oneline -15
```

### Co sprawdzić:
- Czy istnieje `platform/src/app/globals.css`, `layout.tsx`, `page.tsx`?
- Czy istnieje `platform/src/app/(payload)/admin/[[...segments]]/page.tsx`?
- Czy istnieje `platform/src/app/(payload)/api/[...slug]/route.ts`?
- Czy istnieje `platform/src/middleware.ts`?
- Czy istnieje `platform/src/lib/logger.ts` i `platform/src/lib/index.ts`?
- Czy istnieje `platform/src/lib/redis.ts`? (singleton Upstash Redis — B8.5)
- Czy istnieje `platform/src/lib/rate-limit.ts`? (helper rate limitingu — B8.5)
- Czy istnieje `platform/src/app/api/contact/route.ts`? (POST /api/contact — B8.5)
- Czy istnieje `platform/payload.config.ts`?
- Czy istnieje `platform/src/payload/collections/` z 4 plikami (Users, Portfolios, Blocks, Media)?
- Czy istnieje `.github/workflows/ci.yml`?
- Czy `platform/.env.local` jest w `.gitignore` i NIE jest w repo?
- Czy `platform/node_modules/` jest w `.gitignore`?

### Sprawdź .gitignore:
```bash
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/.gitignore
grep -r "\.env\.local\|node_modules" /home/rspro/Dokumenty/1.CODE/2.Portfolio/.gitignore
```

---

## Przebieg 2 — Spójność konfiguracji

**Cel:** Sprawdź czy pliki konfiguracyjne są spójne między sobą.

### Komendy:
```bash
# package.json — zależności
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/package.json

# tsconfig.json — aliasy
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/tsconfig.json

# next.config.ts
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/next.config.ts

# postcss.config.mjs
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/postcss.config.mjs

# payload.config.ts
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/payload.config.ts

# Porównaj zmienne env z template
diff <(grep -E "^[A-Z_]+" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.example | sort) \
     <(grep -E "^[A-Z_]+" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.local.example | sort)
```

### Co sprawdzić:

**package.json vs rzeczywistość:**
- Czy `graphql` jest w dependencies? (wymagane przez @payloadcms/next)
- Czy `pino` i `pino-pretty` są w dependencies?
- Czy `sharp` jest w dependencies? (wymagane przez Next.js image optimization)
- Czy wersje `payload`, `@payloadcms/*` są ze sobą spójne (ten sam major)?
- Czy `eslint-config-next` ma tę samą wersję co `next`?

**tsconfig.json:**
- Czy path alias `@/*` → `./src/*` jest zdefiniowany?
- Czy path alias `@payload-config` → `./payload.config.ts` jest zdefiniowany?
- Czy `moduleResolution: "bundler"` jest ustawiony?
- Czy `strict: true` jest ustawiony?

**payload.config.ts:**
- Czy używa `process.env.PAYLOAD_SECRET`?
- Czy używa `process.env.DATABASE_URL`?
- Czy używa `process.env.NEXT_PUBLIC_SERVER_URL`?
- Czy `upload.limits.fileSize` jest ustawiony?

**Zmienne środowiskowe — sprawdź co jest w .env.local.example ale nie w .env.example i odwrotnie:**
```bash
# Lista kluczy z .env.example
grep -E "^[A-Z_]+=" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.example | cut -d= -f1 | sort > /tmp/env_example.txt

# Lista kluczy z .env.local.example
grep -E "^[A-Z_]+=" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.local.example | cut -d= -f1 | sort > /tmp/env_local_example.txt

# Różnice
echo "=== W .env.example ale nie w .env.local.example ===" && comm -23 /tmp/env_example.txt /tmp/env_local_example.txt
echo "=== W .env.local.example ale nie w .env.example ===" && comm -13 /tmp/env_example.txt /tmp/env_local_example.txt
```

---

## Przebieg 3 — Jakość kodu TypeScript

**Cel:** Uruchom narzędzia statycznej analizy i sprawdź wyniki.

### Komendy:
```bash
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform

# TypeScript typecheck
npm run typecheck 2>&1

# ESLint
npm run lint 2>&1

# Szukaj console.log w kodzie produkcyjnym (nie w node_modules)
grep -rn "console\.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null

# Szukaj TODO/FIXME w kodzie
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" 2>/dev/null

# Szukaj any typowania
grep -rn ": any\|as any\|<any>" src/ --include="*.ts" --include="*.tsx" 2>/dev/null

# Sprawdź czy logger jest importowany poprawnie (nie console.log)
grep -rn "import.*logger\|from.*logger" src/ --include="*.ts" --include="*.tsx" 2>/dev/null

# Sprawdź czy collections używają CollectionConfig
grep -rn "CollectionConfig" src/payload/ 2>/dev/null
```

### Co sprawdzić w wynikach:
- Czy `npm run typecheck` kończy się z exit code 0?
- Czy `npm run lint` nie ma błędów (warningi są OK)?
- Czy jest jakiś `console.log` w plikach produkcyjnych?
- Czy `any` typing pojawia się bez uzasadnienia?
- Czy wszystkie kolekcje Payload importują `CollectionConfig`?

### Sprawdź poszczególne pliki kolekcji:
```bash
# Sprawdź slugi kolekcji (muszą być "users", "portfolios", "blocks", "media")
grep -n "slug:" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/*.ts

# Sprawdź relationTo wartości — muszą pasować do slugów
grep -n "relationTo:" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/*.ts

# Sprawdź czy wszystkie pola required mają sens
grep -n "required: true" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/*.ts
```

---

## Przebieg 4 — Zgodność z PLAN.md

**Cel:** Sprawdź czy to co jest oznaczone jako `[x]` w PLAN.md faktycznie istnieje w kodzie.

### Komendy:
```bash
# Zadania oznaczone jako done w PLAN.md
grep -n "\[x\]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md | head -50

# Zadania wciąż otwarte ([ ])
grep -n "\[ \]" /home/rspro/Dokumenty/1.CODE/2.Portfolio/PLAN.md | head -30
```

### Sprawdź każde zakończone zadanie:

**Faza 0 (wszystkie powinny być [x]):**
- `H13.6`, `H13.7`, `D11.1` — DNS skonfigurowany (weryfikuj przez docs/access.md)
- `H13.8` — domeny w Vercel (weryfikuj przez docs/access.md)
- `H13.9` — 14 zmiennych w Vercel (weryfikuj przez docs/access.md)
- `K12.1–K12.4, K12.6` — Docker scaffold (sprawdź czy pliki istnieją)

```bash
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/Dockerfile
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/docker-compose.dev.yml
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.example
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.local.example
```

**Faza 1 (powinny być [x]):**
- `F9.1` — Next.js scaffold → sprawdź czy `platform/package.json` istnieje z Next.js
- `B8.1` — Payload config → sprawdź `platform/payload.config.ts`
- `B8.2` — Kolekcje → sprawdź 4 pliki w `platform/src/payload/collections/`
- `B8.3`, `D11.3`, `F9.2` — Middleware → sprawdź `platform/src/middleware.ts`
- `B8.5` — Contact API → sprawdź `platform/src/app/api/contact/route.ts`, `lib/redis.ts`, `lib/rate-limit.ts`
- `K12.5` — CI → sprawdź `.github/workflows/ci.yml`

```bash
# Weryfikacja każdego
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/package.json
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/payload.config.ts
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/middleware.ts
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/.github/workflows/ci.yml
```

**Szukaj niespójności:** zadania oznaczone [x] ale plik nie istnieje, lub plik istnieje ale task [ ].

---

## Przebieg 5 — Bezpieczeństwo i sekrety

**Cel:** Upewnij się że żadne prawdziwe sekrety nie trafiły do repo.

### Komendy:
```bash
# Sprawdź czy .env.local jest w gitignore
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio check-ignore -v platform/.env.local 2>&1

# Sprawdź czy .env.local przypadkowo nie jest w repo
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio ls-files platform/.env.local 2>&1

# Szukaj potencjalnych sekretów w śledzonych plikach
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio grep -n "PAYLOAD_SECRET\|DATABASE_URL\|API_KEY\|SECRET\|PASSWORD\|TOKEN" -- "*.ts" "*.tsx" "*.json" "*.yml" "*.yaml" 2>/dev/null | grep -v "process\.env\|env\.\|placeholder\|example\|dummy\|test-secret\|ci-test\|change-to\|xxx\|YOUR_\|<\|>\|#"

# Sprawdź historię git na wypadek accidental commit sekretów
git -C /home/rspro/Dokumenty/1.CODE/2.Portfolio log --all --oneline | head -20

# Sprawdź .env.example — powinno mieć tylko placeholdery
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.example

# Sprawdź .env.local.example — powinno mieć tylko placeholdery
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/.env.local.example
```

### Co sprawdzić:
- Czy `platform/.env.local` jest ignorowany przez git?
- Czy w żadnym śledzonym pliku nie ma prawdziwych sekretów (klucze API, tokeny, hasła)?
- Czy `.env.example` zawiera tylko placeholdery (`xxx`, `change-to-...`, puste wartości)?
- Czy CI workflow ma tylko dummy/placeholder env vars?
- Czy `payload.config.ts` używa `process.env.PAYLOAD_SECRET` a nie hardcoded wartości?

```bash
# Sprawdź CI workflow env vars
grep -A5 "env:" /home/rspro/Dokumenty/1.CODE/2.Portfolio/.github/workflows/ci.yml
```

---

## Przebieg 6 — Spójność architektury (ADR)

**Cel:** Sprawdź czy implementacja jest zgodna z zatwierdzonymi decyzjami architektonicznymi.

### ADRy do weryfikacji:

**ADR-001 — Next.js 15 (App Router):**
```bash
# Sprawdź wersję Next.js
node -e "const p=require('/home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/node_modules/next/package.json'); console.log('Next.js:', p.version)"

# Sprawdź czy używamy App Router (nie Pages Router)
ls /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/ 2>/dev/null
ls /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/pages/ 2>/dev/null
```

**ADR-002 — Payload CMS 3:**
```bash
node -e "const p=require('/home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/node_modules/payload/package.json'); console.log('Payload:', p.version)"
```

**ADR-003 — PostgreSQL 16 (Neon):**
```bash
# Sprawdź czy używamy postgresAdapter z @payloadcms/db-postgres
grep -n "postgresAdapter\|db-postgres" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/payload.config.ts
```

**ADR-004 — Vercel hosting (nie Docker produkcja):**
```bash
# Sprawdź czy next.config.ts ma output: "standalone" (potrzebne dla Docker local)
grep -n "standalone\|output" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/next.config.ts

# Docker powinien być TYLKO dla local dev
grep -n "docker\|Docker" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/docker-compose.dev.yml | head -5
```

**ADR-006 — Tailwind CSS 4:**
```bash
node -e "const p=require('/home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/node_modules/tailwindcss/package.json'); console.log('Tailwind:', p.version)"

# Tailwind v4 — nie powinno być tailwind.config.ts
ls /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/tailwind.config.ts 2>/dev/null || echo "OK — brak tailwind.config.ts (v4 CSS-first)"
ls /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/tailwind.config.js 2>/dev/null || echo "OK — brak tailwind.config.js (v4 CSS-first)"

# Tailwind v4 — globals.css powinno używać @import "tailwindcss"
head -5 /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/globals.css
```

**ADR-008 — Docker tylko local:**
```bash
# Dockerfile powinien być tylko dla local dev
head -5 /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/Dockerfile
```

**ADR-010 — Cloudflare R2 storage:**
```bash
# Sprawdź czy next.config.ts ma R2 w remotePatterns
grep -n "r2.cloudflarestorage\|R2" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/next.config.ts
```

**ADR-009 — PL + EN:**
```bash
# Sprawdź czy Portfolios kolekcja ma pole language
grep -n "language\|pl\|en" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/Portfolios.ts | head -10

# Sprawdź czy Blocks mają pl + en data
grep -n "pl\|en" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/Blocks.ts | head -10
```

---

## Przebieg 7 — Środowisko i zależności

**Cel:** Sprawdź stan środowiska developerskiego i potencjalne problemy z zależnościami.

### Komendy:
```bash
# Wersje narzędzi
node --version
npm --version
docker --version 2>/dev/null || echo "Docker niedostępny"

# Sprawdź zainstalowane wersje kluczowych pakietów
cat /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/package.json | python3 -c "
import json, sys
p = json.load(sys.stdin)
deps = {**p.get('dependencies',{}), **p.get('devDependencies',{})}
key_packages = ['next', 'payload', '@payloadcms/next', '@payloadcms/db-postgres', 
                '@payloadcms/richtext-lexical', 'tailwindcss', 'typescript', 
                'react', 'graphql', 'pino']
for pkg in key_packages:
    print(f'{pkg}: {deps.get(pkg, \"MISSING\")}')
"

# Sprawdź faktycznie zainstalowane wersje (vs deklarowane w package.json)
node -e "
const pkgs = ['next', 'payload', 'tailwindcss', 'typescript', 'react', 'graphql'];
pkgs.forEach(pkg => {
  try {
    const v = require(\`/home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/node_modules/\${pkg}/package.json\`).version;
    console.log(\`\${pkg}: \${v}\`);
  } catch(e) { console.log(\`\${pkg}: NOT INSTALLED\`); }
});
"

# Sprawdź czy node_modules istnieje
ls /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/node_modules/.package-lock.json 2>/dev/null && echo "node_modules: OK" || echo "node_modules: MISSING — run npm install"

# Sprawdź audit bezpieczeństwa zależności
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npm audit --audit-level=high 2>&1 | tail -10

# Sprawdź czy są outdated krytyczne pakiety
cd /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform && npm outdated 2>&1 | head -20

# Sprawdź CI workflow — poprawna wersja Node.js
grep -n "node-version" /home/rspro/Dokumenty/1.CODE/2.Portfolio/.github/workflows/ci.yml

# Sprawdź middleware — poprawne ustawienie nagłówka na REQUEST (nie response)
grep -n "request.*headers\|headers.*request\|requestHeaders" /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/middleware.ts
```

### Co sprawdzić:
- Czy Node.js ≥ 20?
- Czy `graphql` jest zainstalowany (nie tylko w package.json)?
- Czy nie ma CRITICAL npm audit issues?
- Czy middleware ustawia `x-portfolio-slug` na **request** headers (przez `NextResponse.next({ request: { headers: requestHeaders } })`)?

---

## Przebieg 8 — Weryfikacja API endpoints

**Cel:** Sprawdź czy zaimplementowane endpointy są poprawnie skonstruowane (statyczna analiza — bez uruchamiania serwera).

```bash
# Sprawdź czy route handler istnieje
ls -la /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/api/contact/route.ts

# Sprawdź eksport POST (musi być export async function POST)
grep -n "export.*POST\|export.*GET\|export.*PUT\|export.*DELETE" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/api/contact/route.ts

# Sprawdź czy Zod schema jest kompletna (4 pola)
grep -n "z\.object\|portfolioSlug\|\.email()\|\.min\|\.max" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/api/contact/route.ts

# Sprawdź czy checkRateLimit jest importowany i wywoływany
grep -n "checkRateLimit\|rate-limit" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/api/contact/route.ts

# Sprawdź czy Resend jest importowany i wywoływany
grep -n "Resend\|resend\.emails\.send" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/api/contact/route.ts

# Sprawdź czy logger jest używany (nie console.log)
grep -n "logger\.\|console\." \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/app/api/contact/route.ts

# Sprawdź rate-limit helper — logika INCR + EXPIRE
grep -n "incr\|expire\|LIMIT\|WINDOW" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/lib/rate-limit.ts

# Sprawdź Redis singleton — czy waliduje env vars
grep -n "UPSTASH_REDIS_REST_URL\|UPSTASH_REDIS_REST_TOKEN\|throw" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/lib/redis.ts

# Sprawdź czy contactEmail jest w kolekcji Portfolios
grep -n "contactEmail" \
  /home/rspro/Dokumenty/1.CODE/2.Portfolio/platform/src/payload/collections/Portfolios.ts
```

### Co sprawdzić:
- Czy `route.ts` eksportuje `POST` (nie default)?
- Czy Zod schema ma 4 pola z poprawnymi ograniczeniami?
- Czy rate limiting jest PRZED zapytaniem do bazy?
- Czy jest obsługa błędu Resend (try/catch → 500)?
- Czy `x-forwarded-for` → split(",")[0]?.trim() ?? "unknown"?
- Czy `contactEmail` ma fallback do "biuro@korp-cbm.com"?
- Czy Redis waliduje env vars przy inicjalizacji?

---

## Finalna sekcja: Podsumowanie i rekomendacje

Po ukończeniu wszystkich 7 przebiegów:

1. **Policz** wszystkie problemy według poziomu
2. **Priorytetyzuj** — co musi być naprawione przed Fazą 2?
3. **Napisz** 3-5 zdań podsumowania dla dewelopera

### Pytania kontrolne do odpowiedzi w raporcie:

```
Q1: Czy npm run typecheck przechodzi bez błędów? [TAK/NIE + szczegóły]
Q2: Czy npm run lint przechodzi bez błędów? [TAK/NIE + szczegóły]  
Q3: Czy żadne prawdziwe sekrety nie trafiły do repo? [TAK/NIE + szczegóły]
Q4: Czy middleware poprawnie ustawia x-portfolio-slug na request headers? [TAK/NIE]
Q5: Czy wszystkie zadania [x] z PLAN.md mają odpowiadający kod? [TAK/NIE + lista niezgodności]
Q6: Czy Tailwind v4 jest poprawnie skonfigurowany (CSS-first, brak tailwind.config.ts)? [TAK/NIE]
Q7: Czy graphql jest zainstalowany jako dependency? [TAK/NIE]
Q8: Czy .env.local jest w gitignore i nie jest w repo? [TAK/NIE]
Q9: Czy wersje @payloadcms/* są spójne? [TAK/NIE + wersje]
Q10: Czy ADR-001 przez ADR-010 są przestrzegane w kodzie? [TAK/NIE + lista naruszeń]
```

---

## Jak używać tego skilla

Szczegółowe instrukcje uruchamiania wszystkich skillów: `.agents/skills/HOW-TO-RUN.md`

### Skrót dla Copilot:
Wklej zawartość tego pliku do GitHub Copilot Chat (tryb Agent) i wyślij.

### Skrót dla Cline/Continue:
```
Wykonaj audit zgodnie z plikiem: .agents/skills/audit-agent.md
Wszystkie 8 przebiegów. Zapisz wyniki do .agents/audit/audit-DZISIAJ.md
NIE modyfikuj kodu — tylko diagnostyka.
```

---

## Notatki dla Claude (koordynator)

Wyniki audytu z `.agents/audit/audit-*.md` są wejściem dla kolejnych sesji Claude Code.
Przy następnej sesji:
1. Przeczytaj najnowszy plik audytu
2. Porównaj z poprzednim (jeśli istnieje)
3. Priorytetyzuj poprawki według poziomu krytyczności
4. Zaktualizuj PLAN.md jeśli audyt odkryje niespójności
