#!/usr/bin/env bash
# Hook: przed_zadaniem.sh
# Uruchamiaj przed każdym większym zadaniem agenta.
# Cel: załaduj relevantny kontekst z PLAN, sprawdź blokady, zrób RAG query.

set -e

PLAN_DIR="${PLAN_DIR:-docs}"
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
TASK_DESCRIPTION="${1:-}"

echo "=== Przed-zadanie: ładowanie kontekstu ==="
echo "Data: $(date '+%Y-%m-%d %H:%M')"
echo ""

# 1. Sprawdź otwarte blokady [!] w plikach PLAN
echo "--- Zablokowane zadania [!] ---"
if ls "$PLAN_DIR"/PLAN_*.md 2>/dev/null | head -1 > /dev/null; then
    grep -rn "\[!\]" "$PLAN_DIR"/PLAN_*.md 2>/dev/null || echo "Brak blokad — OK"
else
    echo "Brak plików PLAN w $PLAN_DIR — pomiń lub ustaw PLAN_DIR"
fi

echo ""

# 2. Sprawdź otwarte decyzje [?] wymagające uwagi
echo "--- Nierozstrzygnięte decyzje [?] ---"
if ls "$PLAN_DIR"/PLAN_*.md 2>/dev/null | head -1 > /dev/null; then
    grep -rn "\[\?\]" "$PLAN_DIR"/PLAN_*.md 2>/dev/null | head -10 || echo "Brak otwartych decyzji — OK"
fi

echo ""

# 3. RAG query jeśli podano opis zadania
if [ -n "$TASK_DESCRIPTION" ]; then
    echo "--- RAG query dla: '$TASK_DESCRIPTION' ---"
    if curl -s "$OLLAMA_URL/api/tags" > /dev/null 2>&1; then
        echo "Ollama dostępna. Uruchom RAG query w Cline:"
        echo "  @codebase $TASK_DESCRIPTION"
    else
        echo "Ollama niedostępna ($OLLAMA_URL) — pomiń RAG lub uruchom Ollama"
    fi
else
    echo "Podaj opis zadania jako argument: bash przed_zadaniem.sh 'opis zadania'"
fi

echo ""
echo "=== Gotowy do uruchomienia agenta ==="
