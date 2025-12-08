import type { TripAccentPreset } from "@/lib/types/trip";
import { getPrebakedQueries } from "@/lib/prebakedQueries";

type LearnedDestination = {
  queries: string[];
  imageUrl: string;
};

const tokenDictionary: Record<string, string> = {
  polska: "Poland",
  niemcy: "Germany",
  hiszpania: "Spain",
  francja: "France",
  wlochy: "Italy",
  wloch: "Italy",
  chorwacja: "Croatia",
  czechy: "Czech Republic",
  norwegia: "Norway",
  islandia: "Iceland",
  maroko: "Morocco",
  indonezja: "Indonesia",
  "stany zjednoczone": "USA",
  usa: "USA",
  "nowy jork": "New York",
  berlin: "Berlin",
  barcelona: "Barcelona",
  "hiszpania barcelona": "Barcelona",
  paryz: "Paris",
  paryzu: "Paris",
  praga: "Prague",
  pragi: "Prague",
  sopot: "Sopot",
  gdansk: "Gdansk",
  baltyk: "Baltic sea",
  "morze baltyckie": "Baltic sea",
  zakopane: "Zakopane",
  tatry: "Tatra Mountains",
  stolowe: "Table Mountains",
  alpy: "Alps",
  zermatt: "Zermatt",
  bali: "Bali",
  merzouga: "Merzouga",
  sahara: "Sahara desert",
  podlasie: "Podlasie",
  mazury: "Masurian lakes",
  mazur: "Masurian lakes",
  adriatyk: "Adriatic sea",
  nyc: "New York",
  santorini: "Santorini",
  grecja: "Greece",
  greece: "Greece",
  toskania: "Tuscany",
  tuscany: "Tuscany",
  lisbon: "Lisbon",
  lisbona: "Lisbon",
  porto: "Porto",
  warszawa: "Warsaw",
  warsaw: "Warsaw",
  krakow: "Krakow",
  krakowa: "Krakow",
  wroclaw: "Wroclaw",
  wrocław: "Wroclaw",
  malta: "Malta",
  tenerife: "Tenerife",
  kanary: "Canary Islands",
  madeira: "Madeira",
  bieszczady: "Bieszczady Mountains",
  split: "Split",
  plazowanie: "beach",
  "plazowanie.": "beach",
  "plazowanie,": "beach",
  plaze: "beaches",
  plaza: "beach",
  plaz: "beach",
  morze: "sea",
  "surf camp": "surf camp",
  surf: "surf",
  surfing: "surfing",
};

const learnedDestinations = new Map<string, LearnedDestination>();

export function normalizeToAsciiLower(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeKey(text: string) {
  return normalizeToAsciiLower(text).trim();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function translateToEnglishTokens(destination: string) {
  const normalized = normalizeToAsciiLower(destination);
  if (!normalized) return "";

  let translated = normalized;
  for (const [token, replacement] of Object.entries(tokenDictionary)) {
    translated = translated.replace(
      new RegExp(`\\b${escapeRegex(token)}\\b`, "g"),
      replacement
    );
  }

  return translated.replace(/\s+/g, " ").trim();
}

export type LocationDetails = {
  city: string;
  country: string;
  englishCity: string;
  englishCountry: string;
  combined: string;
  englishCombined: string;
  normalized: string;
};

export function getLocationDetails(destination: string): LocationDetails {
  const normalized = normalizeToAsciiLower(destination || "");
  const segments = destination
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const city = segments[0] || "";
  const country = segments.slice(1).join(" ").trim();
  const englishCity = city ? translateToEnglishTokens(city) : "";
  const englishCountry = country ? translateToEnglishTokens(country) : "";
  const combined = [city, country].filter(Boolean).join(" ").trim();
  const englishCombined = [englishCity, englishCountry]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    city,
    country,
    englishCity,
    englishCountry,
    combined,
    englishCombined,
    normalized,
  };
}

function buildLocationPriorityQueries(
  location: LocationDetails,
  presetHints: string[]
) {
  const queries: string[] = [];
  const {
    city,
    country,
    englishCity,
    englishCountry,
    combined,
    englishCombined,
  } = location;
  const addQuery = (value?: string) => {
    if (value) queries.push(value.trim());
  };

  addQuery(englishCombined);
  if (
    englishCountry &&
    englishCity &&
    `${englishCountry} ${englishCity}`.trim() !== englishCombined
  ) {
    addQuery(`${englishCountry} ${englishCity}`);
  }
  addQuery(combined);
  if (country && city) addQuery(`${country} ${city}`);
  addQuery(englishCity && country ? `${englishCity} ${country}` : "");
  addQuery(englishCountry && city ? `${englishCountry} ${city}` : "");

  const firstHint = presetHints[0];
  if (firstHint) {
    [englishCity, city].forEach((value) => {
      if (value) addQuery(`${value} ${firstHint}`);
    });
    [englishCountry, country].forEach((value) => {
      if (value) addQuery(`${value} ${firstHint}`);
    });
  }

  [englishCity, englishCountry, city, country].forEach(addQuery);
  const landscapeHints = ["landscape", "scenic view", "aerial view", "sunrise", "sunset"];
  landscapeHints.forEach((hint) => {
    [englishCity, city, englishCountry, country]
      .filter(Boolean)
      .forEach((value) => addQuery(`${value} ${hint}`));
  });
  return queries.filter(Boolean);
}

export function buildDestinationQueries(
  destination: string,
  preset: TripAccentPreset = "neutral"
) {
  const translated = translateToEnglishTokens(destination || "");
  const locationDetails = getLocationDetails(destination);
  const parts = translated
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const primary = parts[0] || translated || destination.trim() || "";
  const secondary = parts.length > 1 ? parts[1] : "";

  const extraFromPrebaked = getPrebakedQueries(destination);

  const learned = learnedDestinations.get(normalizeKey(destination));
  const extraFromLearned = learned?.queries ?? [];

  const presetHints =
    preset === "mountains"
      ? ["mountains", "landscape", "ridge", "alps"]
      : preset === "beach" || preset === "tropical"
      ? ["beach", "sea", "coast", "sunset"]
      : preset === "city"
      ? ["city", "skyline", "old town"]
      : preset === "lake"
      ? ["lake", "lakes", "water", "sunset"]
      : preset === "winter"
      ? ["winter", "snow", "alps"]
      : preset === "countryside"
      ? ["countryside", "fields", "village"]
      : preset === "desert"
      ? ["desert", "sand"]
      : preset === "adventure"
      ? ["outdoor", "adventure"]
      : [];

  const locationQueries = buildLocationPriorityQueries(
    locationDetails,
    presetHints
  );

  const contextual: string[] = [];
  if (primary && secondary) {
    contextual.push(`${primary} ${secondary}`);
    contextual.push(`${primary} ${secondary} ${presetHints[0] ?? ""}`.trim());
  }

  const descriptiveCombos = [
    `${primary} ${secondary} sunset`.trim(),
    `${primary} ${secondary} aerial view`.trim(),
    `${primary} old town night`.trim(),
    `${primary} skyline night lights`.trim(),
    `${primary} coastline turquoise water`.trim(),
  ];

  const baseQueries = [
    primary,
    `${primary} travel`,
    `${primary} landscape`,
    `${primary} nature`,
    `${primary} best view`,
  ];

  const withPresetHints = presetHints.map((hint) => `${primary} ${hint}`);

  const all = [
    ...locationQueries,
    ...extraFromPrebaked,
    ...extraFromLearned,
    ...contextual,
    ...descriptiveCombos,
    ...baseQueries,
    ...withPresetHints,
  ];

  return Array.from(new Set(all.filter((v) => v && v.trim().length > 0)));
}

export function learnDestination(
  destination: string,
  queries: string[],
  imageUrl: string
) {
  if (!destination || !imageUrl) return;
  const key = normalizeKey(destination);
  if (!key || learnedDestinations.has(key)) return;

  learnedDestinations.set(key, { queries, imageUrl });
}
