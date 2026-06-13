#!/usr/bin/env bash
# Hook: po_zadaniu.sh
# Uruchamiaj po wykonaniu zadania przez agenta.
# Cel: zweryfikuj że PLAN został zaktualizowany, dodaj wpis do CHANGELOG.

set -e

PLAN_DIR="${PLAN_DIR:-docs}"
CHANGELOG="${PLAN_DIR}/CHANGELOG.md"
DATE_TODAY=$(date '+%Y-%m-%d')

echo "=== Po-zadanie: weryfikacja i aktualizacja ==="
echo "Data: $DATE_TODAY"
echo ""

# 1. Sprawdź czy są niedomknięte statusy [~] (w trakcie) starsze niż dziś
echo "--- Zadania [~] w trakcie ---"
if ls "$PLAN_DIR"/PLAN_*.md 2>/dev/null | head -1 > /dev/null; then
    grep -rn "\[~\]" "$PLAN_DIR"/PLAN_*.md 2>/dev/null || echo "Brak zadań w trakcie"
fi

echo ""

# 2. Pokaż ostatnio ukończone [v] z dzisiaj
echo "--- Ukończone dziś [v] ---"
if ls "$PLAN_DIR"/PLAN_*.md 2>/dev/null | head -1 > /dev/null; then
    grep -rn "\[v\].*$DATE_TODAY" "$PLAN_DIR"/PLAN_*.md 2>/dev/null || echo "Brak ukończeń z dziś"
fi

echo ""

# 3. Zaproponuj wpis do CHANGELOG
echo "--- Propozycja wpisu CHANGELOG ---"
echo "Dodaj do $CHANGELOG:"
echo ""
echo "## [$DATE_TODAY]"
echo ""
echo "### Zrobione"
echo "- [PLAN_N §X.Y] [opis zmiany]"
echo ""
echo "### W trakcie"
echo "- [PLAN_N §X.Y] [opis — Kanban: TASK-XXX]"
echo ""

# 4. Sprawdź TODO.md — czy są nowe obserwacje
echo "--- Nowe obserwacje w TODO.md ---"
find . -name "TODO.md" -not -path "./.git/*" 2>/dev/null | while read f; do
    count=$(grep -c "^\- \[ \]" "$f" 2>/dev/null || echo 0)
    if [ "$count" -gt 0 ]; then
        echo "  $f: $count otwartych pozycji"
    fi
done || echo "Brak plików TODO.md"

echo ""
echo "=== Weryfikacja zakończona ==="
