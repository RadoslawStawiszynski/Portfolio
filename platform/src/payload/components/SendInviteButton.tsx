"use client";
import { useDocumentInfo } from "@payloadcms/ui";
import { useState } from "react";

export function SendInviteButton() {
  const { id, savedDocumentData } = useDocumentInfo();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const currentStatus = (savedDocumentData as { status?: string } | undefined)
    ?.status;

  if (currentStatus !== "pending") return null;

  async function handleClick() {
    if (!id) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waitlistId: String(id) }),
      });
      if (res.ok) {
        setStatus("done");
        setMessage("Zaproszenie wysłane! Odśwież stronę, aby zobaczyć zaktualizowany status.");
      } else {
        const data = (await res.json()) as { error?: string };
        setStatus("error");
        setMessage(
          data.error === "invitations_disabled"
            ? "System zaproszeniowy jest wyłączony w Ustawieniach Platformy."
            : data.error === "already_processed"
            ? "To zgłoszenie zostało już przetworzone."
            : `Błąd: ${data.error ?? "nieznany"}`
        );
      }
    } catch {
      setStatus("error");
      setMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  }

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "0.5rem",
        background: "var(--theme-elevation-50)",
      }}
    >
      <p style={{ marginBottom: "1rem", fontWeight: 600 }}>Wyślij zaproszenie</p>
      {status === "done" || status === "error" ? (
        <p style={{ color: status === "done" ? "green" : "red" }}>{message}</p>
      ) : (
        <button
          onClick={handleClick}
          disabled={status === "loading"}
          style={{
            padding: "0.5rem 1.5rem",
            background: "var(--theme-success-500, #16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            opacity: status === "loading" ? 0.7 : 1,
          }}
        >
          {status === "loading" ? "Wysyłanie…" : "Wyślij zaproszenie →"}
        </button>
      )}
    </div>
  );
}
