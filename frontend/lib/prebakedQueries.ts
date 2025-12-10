//import prebakedQueries from "@/data/prebakedQueries.json";
//import prebakedQueriesExtra from "@/data/prebakedQueriesExtra.json";

const map = new Map<string, string[]>();

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

let prebakedQueries: Record<string, unknown> = {};
let prebakedQueriesExtra: Record<string, unknown> = {};

// Załaduj pliki bezpiecznie - jeśli nie istnieją, nie przerywa aplikacji
try {
  prebakedQueries = require("@/data/prebakedQueries.json");
} catch (error) {
  console.warn("prebakedQueries.json not found, using empty object");
}

try {
  prebakedQueriesExtra = require("@/data/prebakedQueriesExtra.json");
} catch (error) {
  console.warn("prebakedQueriesExtra.json not found, using empty object");
}

const sources = [prebakedQueries, prebakedQueriesExtra];

for (const source of sources) {
  try {
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
  } catch (error) {
    console.warn("Error processing prebaked queries:", error);
  }
}

export function getPrebakedQueries(destination: string) {
  try {
    const norm = normalize(destination).trim();
    if (!norm) return [];
    return map.get(norm) ?? [];
  } catch (error) {
    console.warn("Error getting prebaked queries:", error);
    return [];
  }
}
