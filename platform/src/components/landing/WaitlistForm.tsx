// platform/src/components/landing/WaitlistForm.tsx
"use client";
import { useState } from "react";

type FormState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string }
  | { type: "field_errors"; fields: Record<string, string[]> };

export function WaitlistForm() {
  const [state, setState] = useState<FormState>({ type: "idle" });
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ type: "loading" });

    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      note: fd.get("note") as string,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        setState({ type: "success" });
        showToast("Dziękujemy! Odezwiemy się wkrótce.");
        return;
      }

      const data = (await res.json()) as {
        error?: string;
        fields?: Record<string, string[]>;
      };

      if (res.status === 400 && data.fields) {
        setState({ type: "field_errors", fields: data.fields });
        return;
      }
      if (res.status === 409) {
        setState({
          type: "field_errors",
          fields: { email: ["Twoje zgłoszenie już istnieje."] },
        });
        return;
      }
      if (res.status === 429) {
        showToast("Zbyt wiele zgłoszeń — spróbuj za godzinę.");
        setState({ type: "idle" });
        return;
      }
      setState({ type: "error", message: "Coś poszło nie tak. Spróbuj ponownie." });
    } catch {
      setState({ type: "error", message: "Błąd połączenia. Spróbuj ponownie." });
    }
  }

  const fieldErrors =
    state.type === "field_errors" ? state.fields : {};

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-lg space-y-4">
        <div>
          <label
            htmlFor="waitlist-name"
            className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
          >
            Imię i nazwisko *
          </label>
          <input
            id="waitlist-name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="Jan Kowalski"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.name[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="waitlist-email"
            className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
          >
            Adres email *
          </label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="jan@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-500">{fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="waitlist-note"
            className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
          >
            Notatka{" "}
            <span className="font-normal text-[var(--color-muted)]">(opcjonalne)</span>
          </label>
          <textarea
            id="waitlist-note"
            name="note"
            rows={3}
            maxLength={500}
            className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="Czym się zajmujesz? Co chcesz pokazać na portfolio?"
          />
        </div>

        {state.type === "error" && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={state.type === "loading"}
          className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state.type === "loading" ? "Wysyłanie…" : "Wyślij zgłoszenie →"}
        </button>
      </form>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-[var(--color-bg)] shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
