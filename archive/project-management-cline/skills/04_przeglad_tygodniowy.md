---
skill: Tygodniowy przegląd projektu (Periodic Review)
model: qwen3.6:35b
when: Piątek / po milestone / gdy agent zaflagował [?] lub [!]
ref: AI_PROJECT_WORKFLOW.md §11
---

# Skill: Tygodniowy przegląd projektu

```
Przeprowadź przegląd projektu [NazwaProjektu].

PLIKI DO PRZEJRZENIA (dodaj do kontekstu lub użyj @codebase):
- docs/PLAN_INDEX.md
- docs/PLAN_*.md (wszystkie aktywne)
- Wszystkie pliki TODO.md w projekcie
- docs/CHANGELOG.md

TWOJE ZADANIA:

1. ZBIERZ TODO.md → zaproponuj integrację do odpowiednich PLANów
   - Dla każdej pozycji wskaż: PLAN_N §X.Y gdzie powinna trafić
   - Pozycje [v] zaznacz: "zebrano do PLAN_N §X.Y — data"
   - Nic nie usuwaj

2. ZIDENTYFIKUJ problemy:
   - Sekcje [~] starsze niż 7 dni — czy są nadal aktywne czy zapomniane?
   - Sekcje [!] — czy blokada dalej aktualna, co ją odblokuje?
   - Niespójności między PLANami (np. PLAN_2 §X zakłada coś co PLAN_3 §Y robi inaczej)

3. ZAPROPONUJ (oddzielnie — nie zmieniaj planów bez mojej zgody):
   a) Kierunki na kolejny tydzień / sprint
   b) Technical debt wymagający pilnej uwagi
   c) Ryzyka projektowe które widzisz
   d) Czy potrzebny jest nowy plik PLAN_N?

4. AKTUALIZUJ (możesz zrobić bez pytania):
   - docs/PLAN_INDEX.md (statusy modułów)
   - docs/CHANGELOG.md (dodaj wpis z datą dzisiejszą)

5. PYTANIA DO MNIE:
   - Lista wszystkich [?] które czekają na decyzję
   - Dla każdego: kontekst i Twoja rekomendacja

IGNORUJ zawartość między tagami <!--HUMAN i /HUMAN-->
FORMAT: Najpierw raport (co znalazłeś), potem propozycje, na końcu lista pytań do mnie.
```

---

## Harmonogram

- **Kiedy:** Piątek przed weekendem, lub po zamknięciu każdego milestone'u
- **Czas:** ~30-45 minut (agent: ~10 min, review przez człowieka: ~20-35 min)
- **Model:** qwen3.6:35b (duży kontekst potrzebny do wielu plików PLAN naraz)
