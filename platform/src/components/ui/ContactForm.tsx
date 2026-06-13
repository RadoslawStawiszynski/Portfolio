// platform/src/components/ui/ContactForm.tsx
"use client";

import { useState } from "react";

interface Props {
  portfolioSlug: string;
}

export function ContactForm({ portfolioSlug }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const body = {
      portfolioSlug,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(
          json.error === "rate_limit_exceeded"
            ? "Zbyt wiele wiadomości. Spróbuj za 15 minut."
            : "Błąd wysyłania. Spróbuj ponownie."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Błąd połączenia. Spróbuj ponownie.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-[var(--color-accent)] font-medium">
        Wiadomość wysłana! Odezwę się wkrótce.
      </p>
    );
  }

  const inputClass =
    "w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-bg-alt)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <input
        name="name"
        required
        minLength={2}
        placeholder="Imię i nazwisko"
        className={inputClass}
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Adres email"
        className={inputClass}
      />
      <textarea
        name="message"
        required
        minLength={10}
        rows={5}
        placeholder="Wiadomość (min. 10 znaków)"
        className={inputClass}
      />
      {status === "error" && (
        <p className="text-red-500 text-sm">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === "loading" ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
