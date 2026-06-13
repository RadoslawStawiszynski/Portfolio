#!/usr/bin/env bash
# Hook: indeksuj_rag.sh
# Uruchamiaj po każdej znaczącej zmianie plików PLAN.
# Cel: przeindeksuj dokumenty dla lokalnego RAG przez Ollama.

set -e

PLAN_DIR="${PLAN_DIR:-docs}"
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
EMBED_MODEL="${RAG_MODEL:-nomic-embed-text-v2-moe}"
RAG_INDEX_DIR="${PLAN_DIR}/../_ai/rag/index"

echo "=== Indeksowanie RAG ==="
echo "Model: $EMBED_MODEL"
echo "Katalog PLAN: $PLAN_DIR"
echo ""

# Sprawdź czy Ollama dostępna
if ! curl -s "$OLLAMA_URL/api/tags" > /dev/null 2>&1; then
    echo "BŁĄD: Ollama niedostępna pod $OLLAMA_URL"
    echo "Uruchom: ollama serve"
    exit 1
fi

# Sprawdź czy model embeddingów jest dostępny
if ! curl -s "$OLLAMA_URL/api/tags" | grep -q "$EMBED_MODEL"; then
    echo "OSTRZEŻENIE: Model $EMBED_MODEL nie znaleziony w Ollama"
    echo "Uruchom: ollama pull $EMBED_MODEL"
    echo ""
    echo "Alternatywne modele embeddingów:"
    echo "  ollama pull nomic-embed-text"
    echo "  ollama pull mxbai-embed-large"
fi

# Znajdź wszystkie pliki PLAN
PLAN_FILES=$(find "$PLAN_DIR" -name "PLAN_*.md" 2>/dev/null | sort)

if [ -z "$PLAN_FILES" ]; then
    echo "Brak plików PLAN_*.md w $PLAN_DIR"
    exit 0
fi

echo "Pliki do zaindeksowania:"
echo "$PLAN_FILES" | while read f; do echo "  - $f"; done
echo ""

# W Cline możesz użyć @codebase zamiast ręcznego RAG
echo "=== WSKAZÓWKA DLA CLINE ==="
echo "Cline ma wbudowany indeks kodu (@codebase)."
echo "Zamiast tego skryptu użyj w promptcie:"
echo "  @codebase [twoje zapytanie]"
echo ""
echo "Dla zewnętrznego RAG przez Ollama:"
echo "  Użyj MCP serwera: @continue/mcp-memory lub własnego"
echo ""
echo "Pliki PLAN są gotowe do indeksowania:"
echo "$PLAN_FILES"
