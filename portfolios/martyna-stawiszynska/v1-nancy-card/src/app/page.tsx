import Link from "next/link";
import { SectionCard } from "@/components/SectionCard";
import { getActivePalette, getAuthorProfile, getBooks, getPublishedPosts } from "@/lib/data-access";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [author, books, posts, lightPalette] = await Promise.all([
    getAuthorProfile(),
    getBooks(),
    getPublishedPosts(),
    getActivePalette("light")
  ]);

  return (
    <main
      className="home"
      style={{
        // Dynamiczne tokeny kolorystyczne pochodzące z aktywnej palety.
        ["--bg" as string]: lightPalette?.background ?? "#F8F3F3",
        ["--text" as string]: lightPalette?.text ?? "#4B4B4B",
        ["--accent" as string]: lightPalette?.accent ?? "#F9AFAE",
        ["--button" as string]: lightPalette?.button ?? "#FF6F61"
      }}
    >
      <header className="hero">
        <p className="eyebrow">Strona autorska</p>
        <h1>
          {author.fullName} <span>({author.artisticAlias})</span>
        </h1>
        <p>{author.shortBio}</p>
        <div className="hero-actions">
          <a href="#ksiazki" className="btn-primary">
            Zobacz twórczość
          </a>
          <Link href="/login" className="btn-secondary">
            Panel admin
          </Link>
        </div>
      </header>

      <SectionCard title="O autorce">
        <p>{author.fullBio}</p>
        <p>
          <strong>Lokalizacja:</strong> {author.location ?? "Do uzupełnienia"}
        </p>
        <ul>
          {author.officialLinks.map((link) => (
            <li key={link.label}>
              {link.url === "oczekuje_na_oficjalne_linki" ? (
                <span>
                  {link.label}: <em>oczekuje_na_oficjalne_linki</em>
                </span>
              ) : (
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              )}
              {!link.verified ? " (do weryfikacji)" : ""}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Książki">
        <div id="ksiazki" className="grid books">
          {books.map((book) => (
            <article key={book.id} className="tile">
              <h3>{book.title}</h3>
              <p>{book.shortDescription}</p>
              <p>
                <strong>Wydawnictwo:</strong> {book.publisher ?? "Brak"}
              </p>
              <p>
                <strong>Data wydania:</strong> {formatDate(book.releaseDate)}
              </p>
              <p>
                <strong>Pewność:</strong> {book.confidence}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Aktualności">
        <div className="grid posts">
          {posts.map((post) => (
            <article key={post.id} className="tile">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>
                <strong>Publikacja:</strong> {formatDate(post.publishedAt)}
              </p>
            </article>
          ))}
        </div>
      </SectionCard>

      <footer className="footer">
        <p>Projekt wizytówki autorskiej NancyM | v1</p>
      </footer>
    </main>
  );
}
