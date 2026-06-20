export type ConfidenceLevel = "high" | "medium" | "low";
export type SourceType = "official" | "store" | "media" | "community";

export type AuthorProfile = {
  id: string;
  fullName: string;
  artisticAlias: string;
  shortBio: string;
  fullBio: string;
  location?: string;
  officialLinks: Array<{ label: string; url: string; verified: boolean }>;
};

export type Book = {
  id: string;
  title: string;
  series?: string;
  volume?: string;
  shortDescription: string;
  releaseDate?: string;
  publisher?: string;
  isbn?: string;
  coverUrl?: string;
  confidence: ConfidenceLevel;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  publishedAt?: string;
  coverMediaId?: string;
};

export type ThemePalette = {
  id: string;
  name: string;
  mode: "light" | "dark";
  background: string;
  text: string;
  accent: string;
  button: string;
  archived: boolean;
  active: boolean;
};

export type MediaAsset = {
  id: string;
  url: string;
  type: "image" | "video";
  alt: string;
  source: string;
  metadata?: Record<string, string | number | boolean>;
};

export type SourceEntry = {
  id: string;
  label: string;
  url: string;
  sourceType: SourceType;
  confidence: ConfidenceLevel;
  note: string;
  accessedAt: string;
};
