# ⚠️ DEPRECATED — Session Handoff

**Ten skill jest nieaktywny od 2026-06-14.**

## Zamiennik

Używaj globalnego skilla `/remember` (Claude Code):

```
/remember
```

Skill `/remember` zapisuje stan sesji do `.remember/remember.md` — ten plik jest automatycznie wczytywany przez hook przy starcie każdej sesji.

## Dlaczego deprecated?

- `/remember` robi to samo, ale lepiej — korzysta z ustrukturyzowanego formatu handoff
- Startup hook (`=== HANDOFF ===`) automatycznie wskazuje plik docelowy
- Brak potrzeby oddzielnego commitu stanu sesji — stan jest lokalny, nie w git history

## Co zostało w tym skilla

Jeśli potrzebujesz odtworzyć stary mechanizm `.remember/now.md` + `.remember/today-*.md` — sprawdź `archive/` lub git history tego pliku.
