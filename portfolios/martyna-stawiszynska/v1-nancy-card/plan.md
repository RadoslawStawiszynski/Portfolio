# Plan wdrożenia v1 - NancyM Card

Krótki komentarz: plan operacyjny do realizacji wizytówki + panelu admin w stacku Next.js + Supabase.

## Etap 1 - Fundament techniczny

- Uruchomić projekt `Next.js (App Router, TypeScript)`.
- Skonfigurować zmienne środowiskowe Supabase.
- Wykonać `supabase/schema.sql` i utworzyć bucket `assets`.
- Wgrać dane startowe: profil autorki, książki, palety, źródła.

Kryterium akceptacji:
- Publiczna strona renderuje dane z bazy (lub fallback, jeśli brak połączenia).

## Etap 2 - Publiczna wizytówka

- Sekcje: Hero, O autorce, Książki, Aktualności, Footer.
- Dynamiczne kolory z aktywnej palety (`light`/`dark`).
- Responsywność mobile/desktop.
- Dopracowanie stylu: klimat "Murakami-style + jasny kobiecy".

Kryterium akceptacji:
- Strona jest czytelna, charakterystyczna i spójna wizualnie.

## Etap 3 - Panel administracyjny

- Logowanie przez Supabase Auth (email + hasło).
- CRUD v1: posty, palety, media (upload do `assets`).
- Walidacja formularzy i obsługa błędów.
- Rewalidacja widoków po zmianach (`/`, `/admin`).

Kryterium akceptacji:
- Po zalogowaniu można dodać post, zmienić paletę i dodać media.

## Etap 4 - Dane i wiarygodność

- Utrzymywać `dane-nancy-ai/dane.md` jako źródło copy do strony.
- Utrzymywać `dane-nancy-ai/zrodla.md` z tagami pewności (`high/medium/low`).
- Oznaczyć sekcje niepotwierdzone jako `do weryfikacji`.

Kryterium akceptacji:
- Każda kluczowa informacja na stronie ma odnośnik do źródła.

## Etap 5 - Jakość i bezpieczeństwo

- RLS dla wszystkich tabel (publiczny odczyt, zapis dla authenticated).
- Ochrona panelu przed wejściem bez sesji.
- Smoke test po deployu: główna strona, logowanie, dodanie posta, zmiana palety, upload media.

Kryterium akceptacji:
- Brak regresji w krytycznych ścieżkach i brak publicznego dostępu do operacji admin.

## Następne rozszerzenia (v1.1+)

- Role `admin/editor` oraz whitelista e-mail.
- Podgląd zmian w czasie rzeczywistym (live preview).
- Sekcja newsletter i analytics panel.
- Warianty motywu sezonowego i edytor landing hero.
