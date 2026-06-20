# NancyM Card

Wizytówka autorska Martyny Stawiszyńskiej (NancyM) z panelem admin (`Next.js + Supabase`).

## Co zawiera v1

- Publiczna strona: hero, bio, książki, aktualności.
- Panel admin po logowaniu: dodawanie postów, palet, upload mediów.
- Model danych i SQL schema Supabase.
- Zbiory treści i źródła w `dane-nancy-ai/`.

## Wymagania

- Node.js 20+
- NPM 10+
- Konto i projekt Supabase

## Start lokalny

1. Skopiuj `.env.example` do `.env.local` i uzupełnij wartości.
2. Wykonaj SQL z `supabase/schema.sql` w panelu Supabase.
3. Utwórz bucket Storage o nazwie `assets`.
4. Zainstaluj zależności: `npm install`.
5. Uruchom dev server: `npm run dev`.

## Auth admin

- Login używa Supabase Auth (`email + hasło`).
- Jeśli ustawisz `ADMIN_EMAIL`, tylko ten adres przejdzie do panelu admin.

## Struktura treści

- Dane robocze pod stronę: `dane-nancy-ai/dane.md`.
- Rejestr źródeł i poziomów pewności: `dane-nancy-ai/zrodla.md`.
- Plan wdrożenia: `plan.md`.

Zaimplementowałem plan end-to-end: powstał szkielet aplikacji `Next.js + Supabase`, panel admin, model danych, SQL, oraz uporządkowane pliki Markdown i baza danych treści.

**Co zostało zrobione**

- Publiczna wizytówka + styl: [src/app/page.tsx](/home/rspro/Dokumenty/CODE/nancy_card/src/app/page.tsx), [src/app/globals.css](/home/rspro/Dokumenty/CODE/nancy_card/src/app/globals.css)
- Logowanie i panel admin (`posty + kolory + media`):  
  [src/app/login/page.tsx](/home/rspro/Dokumenty/CODE/nancy_card/src/app/login/page.tsx),  
  [src/app/login/actions.ts](/home/rspro/Dokumenty/CODE/nancy_card/src/app/login/actions.ts),  
  [src/app/admin/page.tsx](/home/rspro/Dokumenty/CODE/nancy_card/src/app/admin/page.tsx),  
  [src/app/admin/actions.ts](/home/rspro/Dokumenty/CODE/nancy_card/src/app/admin/actions.ts)
- Whitelist admin po `ADMIN_EMAIL`: [src/lib/auth.ts](/home/rspro/Dokumenty/CODE/nancy_card/src/lib/auth.ts)
- Typy domenowe i data layer (z fallbackiem):  
  [src/types/domain.ts](/home/rspro/Dokumenty/CODE/nancy_card/src/types/domain.ts),  
  [src/lib/data-access.ts](/home/rspro/Dokumenty/CODE/nancy_card/src/lib/data-access.ts),  
  [src/lib/fallback-data.ts](/home/rspro/Dokumenty/CODE/nancy_card/src/lib/fallback-data.ts)
- Konfiguracja projektu: [package.json](/home/rspro/Dokumenty/CODE/nancy_card/package.json), [tsconfig.json](/home/rspro/Dokumenty/CODE/nancy_card/tsconfig.json), [.env.example](/home/rspro/Dokumenty/CODE/nancy_card/.env.example), [README.md](/home/rspro/Dokumenty/CODE/nancy_card/README.md)
- SQL schema + RLS + storage policies: [supabase/schema.sql](/home/rspro/Dokumenty/CODE/nancy_card/supabase/schema.sql)
- Uporządkowane Markdowny: [theme_list.md](/home/rspro/Dokumenty/CODE/nancy_card/theme_list.md), [linki.md](/home/rspro/Dokumenty/CODE/nancy_card/linki.md)
- Dane internetowe i źródła:  
  [dane-nancy-ai/dane.md](/home/rspro/Dokumenty/CODE/nancy_card/dane-nancy-ai/dane.md),  
  [dane-nancy-ai/zrodla.md](/home/rspro/Dokumenty/CODE/nancy_card/dane-nancy-ai/zrodla.md),  
  [dane.md](/home/rspro/Dokumenty/CODE/nancy_card/dane.md)
- Plan wdrożenia zapisany: [plan.md](/home/rspro/Dokumenty/CODE/nancy_card/plan.md)

**Ważna informacja**

- Nie mogłem uruchomić `npm install`, `lint`, `build` ani testów, bo w środowisku nie ma Node/NPM (`node`/`npm` command not found).

**Naturalne następne kroki**

1. Zainstalować Node.js 20+ i uruchomić: `npm install && npm run dev`.
2. Wykonać SQL z [supabase/schema.sql](/home/rspro/Dokumenty/CODE/nancy_card/supabase/schema.sql) i skonfigurować `.env.local`.
3. Podać oficjalne linki social NancyM, a ja od razu podmienię `oczekuje_na_oficjalne_linki` w danych i na stronie.
