export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[ąćęłńóśżź]/g, (char) => {
      const map: Record<string, string> = {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ż: "z",
        ź: "z"
      };
      return map[char] ?? char;
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date?: string): string {
  if (!date) return "Brak daty";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(parsed);
}
