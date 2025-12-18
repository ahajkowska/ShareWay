import type { TripAccentPreset } from "@/lib/types/trip";
import {
  PRESET_HINTS,
  ATTRACTION_HINTS,
  GENERIC_HINTS,
} from "@/lib/imagePresets";

export type LocationDetails = {
  city: string;
  country: string;
  englishCity: string;
  englishCountry: string;
  combined: string;
  englishCombined: string;
  normalized: string;
};

export function normalizeToAsciiLower(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeKey(text: string) {
  return normalizeToAsciiLower(text).trim();
}

export async function getLocationDetails(
  input: string
): Promise<LocationDetails> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
    input
  )}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TripImageFinder/1.0" },
      cache: "force-cache",
    });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return {
        city: "",
        country: "",
        englishCity: input,
        englishCountry: "",
        combined: input,
        englishCombined: input,
        normalized: normalizeToAsciiLower(input),
      };
    }

    const place = data[0];
    const city =
      place.address?.city ||
      place.address?.town ||
      place.address?.village ||
      place.display_name?.split(",")[0] ||
      "";
    const country = place.address?.country || "";

    const combined = [city, country].filter(Boolean).join(", ");

    return {
      city,
      country,
      englishCity: city,
      englishCountry: country,
      combined,
      englishCombined: combined,
      normalized: normalizeToAsciiLower(input),
    };
  } catch {
    return {
      city: "",
      country: "",
      englishCity: input,
      englishCountry: "",
      combined: input,
      englishCombined: input,
      normalized: normalizeToAsciiLower(input),
    };
  }
}

export function buildDestinationQueries(
  location: LocationDetails,
  preset: TripAccentPreset = "neutral"
): string[] {
  const { englishCity, englishCountry, combined, englishCombined } = location;

  const baseTerms = [englishCombined, combined, englishCity, englishCountry]
    .filter(Boolean)
    .map((v) => v.trim());

  const queries = new Set<string>();
  const presetHints = PRESET_HINTS[preset] ?? PRESET_HINTS.neutral;

  for (const term of baseTerms) {
    ATTRACTION_HINTS.forEach((hint) => queries.add(`${term} ${hint}`));
    presetHints.forEach((hint) => queries.add(`${term} ${hint}`));
    GENERIC_HINTS.forEach((hint) => queries.add(`${term} ${hint}`));
  }

  return Array.from(queries);
}

type LearnedDestination = {
  queries: string[];
  imageUrl: string;
};

const learnedDestinations = new Map<string, LearnedDestination>();

export function learnDestination(
  destination: string,
  queries: string[],
  imageUrl: string
) {
  if (!destination || !imageUrl) return;
  const key = normalizeKey(destination);
  if (learnedDestinations.has(key)) return;
  learnedDestinations.set(key, { queries, imageUrl });
}
