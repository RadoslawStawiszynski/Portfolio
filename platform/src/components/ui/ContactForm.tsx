"use client";
import { useActionState } from "react";
import { sendContactMessage } from "@/app/(portfolio)/actions";

interface Props {
  portfolioSlug: string;
}

const inputClass =
  "w-full px-4 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-bg-alt)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]";

const fieldErrorClass = "text-red-500 text-xs mt-1";

export function ContactForm({ portfolioSlug }: Props) {
  const [state, formAction, isPending] = useActionState(sendContactMessage, null);

  if (state && "success" in state && state.success) {
    return (
      <p className="text-[var(--color-accent)] font-medium">
        Wiadomość wysłana! Odezwę się wkrótce.
      </p>
    );
  }

  const fields =
    state && "fields" in state ? state.fields : {};

  const generalError =
    state && "error" in state && state.error !== "validation"
      ? state.error === "rate_limit_exceeded"
        ? "Zbyt wiele wiadomości. Spróbuj za 15 minut."
        : "Błąd wysyłania. Spróbuj ponownie."
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-lg">
      <input type="hidden" name="portfolioSlug" value={portfolioSlug} />

      <div>
        <input
          name="name"
          required
          minLength={2}
          placeholder="Imię i nazwisko"
          className={inputClass}
          aria-describedby={fields.name ? "error-name" : undefined}
        />
        {fields.name && (
          <p id="error-name" className={fieldErrorClass}>
            {fields.name[0]}
          </p>
        )}
      </div>

      <div>
        <input
          name="email"
          type="email"
          required
          placeholder="Adres email"
          className={inputClass}
          aria-describedby={fields.email ? "error-email" : undefined}
        />
        {fields.email && (
          <p id="error-email" className={fieldErrorClass}>
            {fields.email[0]}
          </p>
        )}
      </div>

      <div>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Wiadomość (min. 10 znaków)"
          className={inputClass}
          aria-describedby={fields.message ? "error-message" : undefined}
        />
        {fields.message && (
          <p id="error-message" className={fieldErrorClass}>
            {fields.message[0]}
          </p>
        )}
      </div>

      {generalError && (
        <p className="text-red-500 text-sm" role="alert">
          {generalError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="px-8 py-3 bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isPending ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
