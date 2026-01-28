import prebakedQueries from "@/data/prebakedQueries.json";
import prebakedQueriesExtra from "@/data/prebakedQueriesExtra.json";

const map = new Map<string, string[]>();

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const sources = [
  prebakedQueries as Record<string, unknown>,
  prebakedQueriesExtra as Record<string, unknown>,
];

for (const source of sources) {
  for (const [key, value] of Object.entries(source)) {
    const norm = normalize(key).trim();
    if (!norm) continue;
    if (Array.isArray(value)) {
      const asStrings = value
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && "query" in item) {
            const query = (item as { query?: unknown }).query;
            return typeof query === "string" ? query : null;
          }
          return null;
        })
        .filter((v): v is string => !!v);

      const unique = Array.from(new Set(asStrings));
      if (unique.length) map.set(norm, unique);
    }
  }
}

export function getPrebakedQueries(destination: string) {
  const norm = normalize(destination).trim();
  if (!norm) return [];
  return map.get(norm) ?? [];
}
