import { fallbackAuthor, fallbackBooks, fallbackPalettes, fallbackPosts } from "@/lib/fallback-data";
import { getServerSupabaseClient } from "@/lib/supabase";
import { AuthorProfile, Book, Post, ThemePalette } from "@/types/domain";

export async function getAuthorProfile(): Promise<AuthorProfile> {
  try {
    const client = await getServerSupabaseClient();
    const { data, error } = await client.from("author_profile").select("*").limit(1).single();

    if (error || !data) return fallbackAuthor;

    return {
      id: data.id,
      fullName: data.full_name,
      artisticAlias: data.artistic_alias,
      shortBio: data.short_bio,
      fullBio: data.full_bio,
      location: data.location,
      officialLinks: data.official_links ?? []
    };
  } catch {
    return fallbackAuthor;
  }
}

export async function getBooks(): Promise<Book[]> {
  try {
    const client = await getServerSupabaseClient();
    const { data, error } = await client.from("books").select("*").order("release_date", { ascending: false });

    if (error || !data?.length) return fallbackBooks;

    return data.map((book) => ({
      id: book.id,
      title: book.title,
      series: book.series,
      volume: book.volume,
      shortDescription: book.short_description,
      releaseDate: book.release_date,
      publisher: book.publisher,
      isbn: book.isbn,
      coverUrl: book.cover_url,
      confidence: book.confidence
    }));
  } catch {
    return fallbackBooks;
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  try {
    const client = await getServerSupabaseClient();
    const { data, error } = await client
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error || !data?.length) return fallbackPosts;

    return data.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      status: post.status,
      publishedAt: post.published_at,
      coverMediaId: post.cover_media_id
    }));
  } catch {
    return fallbackPosts;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const client = await getServerSupabaseClient();
    const { data, error } = await client.from("posts").select("*").order("created_at", { ascending: false });

    if (error || !data?.length) return fallbackPosts;

    return data.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      status: post.status,
      publishedAt: post.published_at,
      coverMediaId: post.cover_media_id
    }));
  } catch {
    return fallbackPosts;
  }
}

export async function getActivePalette(mode: "light" | "dark"): Promise<ThemePalette | undefined> {
  try {
    const client = await getServerSupabaseClient();
    const { data, error } = await client
      .from("themes")
      .select("*")
      .eq("active", true)
      .eq("mode", mode)
      .limit(1)
      .single();

    if (error || !data) {
      return fallbackPalettes.find((palette) => palette.mode === mode && palette.active);
    }

    return {
      id: data.id,
      name: data.name,
      mode: data.mode,
      background: data.background,
      text: data.text,
      accent: data.accent,
      button: data.button,
      archived: data.archived,
      active: data.active
    };
  } catch {
    return fallbackPalettes.find((palette) => palette.mode === mode && palette.active);
  }
}

export async function getAllPalettes(): Promise<ThemePalette[]> {
  try {
    const client = await getServerSupabaseClient();
    const { data, error } = await client.from("themes").select("*").order("name", { ascending: true });

    if (error || !data?.length) return fallbackPalettes;

    return data.map((palette) => ({
      id: palette.id,
      name: palette.name,
      mode: palette.mode,
      background: palette.background,
      text: palette.text,
      accent: palette.accent,
      button: palette.button,
      archived: palette.archived,
      active: palette.active
    }));
  } catch {
    return fallbackPalettes;
  }
}
