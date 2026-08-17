"use client";
import { useActionState } from "react";

type FormResult = { error?: string } | undefined;

interface JoinFormProps {
  action: (subdomain: string, password: string) => Promise<FormResult>;
  platformDomain: string;
}

export function JoinForm({ action, platformDomain }: JoinFormProps) {
  const [state, formAction, isPending] = useActionState<FormResult, FormData>(
    async (_prev: FormResult, formData: FormData) => {
      const subdomain = (formData.get("subdomain") as string) ?? "";
      const password = (formData.get("password") as string) ?? "";
      const confirmPassword = (formData.get("confirmPassword") as string) ?? "";

      if (password !== confirmPassword) {
        return { error: "Hasła nie są zgodne." };
      }
      if (password.length < 8) {
        return { error: "Hasło musi mieć co najmniej 8 znaków." };
      }

      return action(subdomain, password);
    },
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="subdomain"
          className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
        >
          Subdomena *
        </label>
        <div className="flex items-center gap-2">
          <input
            id="subdomain"
            name="subdomain"
            type="text"
            required
            minLength={3}
            maxLength={30}
            pattern="[a-z0-9-]+"
            className="flex-1 rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="jan"
          />
          <span className="shrink-0 text-sm text-[var(--color-muted)]">
            .{platformDomain}
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Tylko litery a-z, cyfry i myślniki (3–30 znaków).
        </p>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
        >
          Hasło *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-[var(--color-primary)]"
        >
          Potwierdź hasło *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="w-full rounded-xl border border-[var(--color-bg-alt)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] shadow transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Tworzenie konta…" : "Utwórz konto →"}
      </button>
    </form>
  );
}
