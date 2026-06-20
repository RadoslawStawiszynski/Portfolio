import Link from "next/link";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <h1>Panel administracyjny NancyM</h1>
        <p>Zaloguj się, aby zarządzać postami, paletami i mediami.</p>

        {params.error ? (
          <p role="alert" style={{ color: "#9c3131", fontWeight: 700 }}>
            {decodeURIComponent(params.error)}
          </p>
        ) : null}

        <form action={loginAction}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />

          <label htmlFor="password">Hasło</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />

          <button type="submit">Zaloguj</button>
        </form>

        <p>
          <Link href="/">Powrót na stronę główną</Link>
        </p>
      </section>
    </main>
  );
}
