"use client";
import { useState, useEffect } from "react";

const COOKIE_NAME = "cookie-consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function getConsent(): "accepted" | "declined" | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  return (match?.[1] as "accepted" | "declined") ?? null;
}

function setConsent(value: "accepted" | "declined") {
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsent("accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent("declined");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookie"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-alt)] border-t border-[var(--color-bg)] px-4 py-3 shadow-lg"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <p className="text-sm text-[var(--color-text)]">
          Ta strona używa plików cookie do zapamiętania preferencji motywu (jasny/ciemny).{" "}
          <span className="text-[var(--color-muted)]">
            Nie używamy ciasteczek reklamowych ani śledzących.
          </span>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="px-3 py-1.5 text-sm rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          >
            Odrzuć
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--color-bg)] focus-visible:outline-offset-2"
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
