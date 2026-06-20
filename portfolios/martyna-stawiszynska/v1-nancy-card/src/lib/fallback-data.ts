import { AuthorProfile, Book, Post, ThemePalette } from "@/types/domain";

export const fallbackAuthor: AuthorProfile = {
  id: "author-1",
  fullName: "Martyna Stawiszyńska",
  artisticAlias: "NancyM",
  shortBio: "Autorka literatury młodzieżowej i obyczajowej, związana z muzyką i storytellingiem emocjonalnym.",
  fullBio:
    "Martyna Stawiszyńska to autorka znana z powieści łączących emocje, muzykę i relacje międzyludzkie. Twórczość obejmuje m.in. serię 'Ten drugi ty' oraz powieść 'Zapomniany takt'.",
  location: "Polska (pochodzenie: Tczew)",
  officialLinks: [
    {
      label: "Oficjalne profile NancyM",
      url: "oczekuje_na_oficjalne_linki",
      verified: false
    }
  ]
};

export const fallbackBooks: Book[] = [
  {
    id: "book-zapomniany-takt",
    title: "Zapomniany takt",
    shortDescription:
      "Powieść obyczajowo-romansowa osadzona w klimacie muzycznym, skupiona na presji perfekcjonizmu, relacjach i emocjach.",
    releaseDate: "2024-06-19",
    publisher: "Papierowe Serca",
    confidence: "high"
  },
  {
    id: "book-ten-drugi-ty-1",
    title: "Ten drugi ty. Tom 1",
    series: "Ten drugi ty",
    volume: "Tom 1",
    shortDescription:
      "Młodzieżowa historia z wątkiem tajemnicy i elementami fantasy, koncentrująca się na odkrywaniu prawdy.",
    releaseDate: "2024-01-01",
    publisher: "Lekkie Wydawnictwo",
    confidence: "medium"
  },
  {
    id: "book-ten-drugi-ty-2",
    title: "Ten drugi ty. Tom 2",
    series: "Ten drugi ty",
    volume: "Tom 2",
    shortDescription:
      "Kontynuacja serii rozwijająca relacje bohaterów i konsekwencje kluczowych odkryć z pierwszego tomu.",
    releaseDate: "2023-01-01",
    publisher: "Lekkie Wydawnictwo",
    confidence: "medium"
  }
];

export const fallbackPosts: Post[] = [
  {
    id: "post-1",
    title: "Witaj na stronie autorskiej",
    slug: "witaj-na-stronie-autorskiej",
    content:
      "To miejsce będzie rozwijane o wpisy, nowości wydawnicze oraz materiały zza kulis pracy twórczej.",
    status: "published",
    publishedAt: "2026-03-23"
  }
];

export const fallbackPalettes: ThemePalette[] = [
  {
    id: "palette-1-light",
    name: "Pastelowa Elegancja",
    mode: "light",
    background: "#F8F3F3",
    text: "#4B4B4B",
    accent: "#F9AFAE",
    button: "#FF6F61",
    archived: false,
    active: true
  },
  {
    id: "palette-1-dark",
    name: "Pastelowa Elegancja",
    mode: "dark",
    background: "#2E2E2E",
    text: "#F4F4F4",
    accent: "#FFB6B6",
    button: "#D67A7A",
    archived: false,
    active: true
  }
];
