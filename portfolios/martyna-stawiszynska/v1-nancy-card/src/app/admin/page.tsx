import Link from "next/link";
import { getAllPalettes, getAllPosts } from "@/lib/data-access";
import { requireAdminSession } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { createPaletteAction, createPostAction, logoutAction, uploadMediaAction } from "./actions";

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { session } = await requireAdminSession();

  const params = await searchParams;
  const [posts, palettes] = await Promise.all([getAllPosts(), getAllPalettes()]);

  return (
    <main className="admin-wrap">
      <section className="admin-shell">
        <header className="section-card">
          <h1>Panel administracyjny</h1>
          <p>Zalogowano jako: {session.user.email}</p>
          <p>
            <Link href="/">Podgląd strony głównej</Link>
          </p>
          <form action={logoutAction}>
            <button type="submit">Wyloguj</button>
          </form>
          {params.error ? (
            <p role="alert" style={{ color: "#9c3131", fontWeight: 700 }}>
              {decodeURIComponent(params.error)}
            </p>
          ) : null}
        </header>

        <section className="admin-grid">
          <article className="section-card">
            <h2>Dodaj post</h2>
            <form action={createPostAction}>
              <label htmlFor="title">Tytuł</label>
              <input id="title" name="title" required minLength={3} />

              <label htmlFor="content">Treść (Markdown)</label>
              <textarea id="content" name="content" required minLength={10} rows={6} />

              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue="draft">
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>

              <button type="submit">Zapisz post</button>
            </form>
          </article>

          <article className="section-card">
            <h2>Dodaj paletę</h2>
            <form action={createPaletteAction}>
              <label htmlFor="name">Nazwa</label>
              <input id="name" name="name" required />

              <label htmlFor="mode">Tryb</label>
              <select id="mode" name="mode" defaultValue="light">
                <option value="light">light</option>
                <option value="dark">dark</option>
              </select>

              <label htmlFor="background">Background</label>
              <input id="background" name="background" defaultValue="#F8F3F3" required pattern="^#[0-9a-fA-F]{6}$" />

              <label htmlFor="text">Text</label>
              <input id="text" name="text" defaultValue="#4B4B4B" required pattern="^#[0-9a-fA-F]{6}$" />

              <label htmlFor="accent">Accent</label>
              <input id="accent" name="accent" defaultValue="#F9AFAE" required pattern="^#[0-9a-fA-F]{6}$" />

              <label htmlFor="button">Button</label>
              <input id="button" name="button" defaultValue="#FF6F61" required pattern="^#[0-9a-fA-F]{6}$" />

              <label>
                <input type="checkbox" name="active" defaultChecked /> Ustaw jako aktywną dla trybu
              </label>

              <button type="submit">Zapisz paletę</button>
            </form>
          </article>

          <article className="section-card">
            <h2>Upload media</h2>
            <form action={uploadMediaAction}>
              <label htmlFor="media">Plik (max 5MB)</label>
              <input id="media" name="media" type="file" required />

              <label htmlFor="alt">Tekst ALT</label>
              <input id="alt" name="alt" required />

              <label htmlFor="source">Źródło</label>
              <input id="source" name="source" defaultValue="admin-upload" />

              <button type="submit">Wyślij plik</button>
            </form>
          </article>
        </section>

        <section className="section-card">
          <h2>Ostatnie posty</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <strong>{post.title}</strong> ({post.status}) - {formatDate(post.publishedAt)}
              </li>
            ))}
          </ul>
        </section>

        <section className="section-card">
          <h2>Palety kolorów</h2>
          <ul>
            {palettes.map((palette) => (
              <li key={palette.id}>
                <strong>{palette.name}</strong> [{palette.mode}] - active: {String(palette.active)}
              </li>
            ))}
          </ul>
        </section>
      </section>
    </main>
  );
}
