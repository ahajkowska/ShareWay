import type { TripAccentPreset } from "@/lib/types/trip";
import { getPrebakedQueries } from "@/lib/prebakedQueries";

export type DestinationEntry = {
  match: RegExp;
  url: string;
  queries: string[];
  leadQuery?: string;
};

type LearnedDestination = {
  queries: string[];
  imageUrl: string;
};

export const destinationFallbacks: DestinationEntry[] = [
  {
    match: /zakopane|tatry|kudowa|stolowe/,
    url: "https://images.pexels.com/photos/1441974/pexels-photo-1441974.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Tatra Mountains Poland winter landscape",
      "Zakopane Tatra Mountains Poland winter",
      "Poland mountains winter landscape",
    ],
  },
  {
    match: /sopot|baltyk|morze baltyckie|gdansk|gdynia/,
    url: "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Baltic sea coast Poland beach",
      "Sopot Baltic sea Poland",
      "Baltic sea Poland seaside",
    ],
  },
  {
    match: /zermatt|alpy|alps/,
    url: "https://images.pexels.com/photos/547115/pexels-photo-547115.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: ["Zermatt Swiss Alps mountains", "Swiss Alps mountain landscape"],
  },
  {
    match: /berlin|niemcy|germany/,
    url: "https://images.pexels.com/photos/532892/pexels-photo-532892.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Berlin city skyline Germany",
      "Berlin Germany city",
      "Brandenburg Gate Berlin Germany",
    ],
  },
  {
    match: /nowy jork|nowy york|nyc|new york/,
    url: "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "New York City skyline night",
      "NYC skyline sunset",
      "New York City aerial view",
    ],
  },
  {
    match: /paryz|paris/,
    url: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Paris Eiffel Tower sunset",
      "Paris city skyline",
      "Eiffel Tower Paris night",
    ],
  },
  {
    match: /praga|prague/,
    url: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Prague Charles Bridge night",
      "Prague old town skyline",
      "Prague castle river",
    ],
  },
  {
    match: /barcelona|hiszpania barcelona/,
    url: "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Barcelona city skyline",
      "Barcelona Sagrada Familia aerial",
      "Barcelona Spain beach city",
    ],
  },
  {
    match: /chorwacja|croatia|split|dubrovnik|zadar|pula|makarska|hvar|trogir/,
    url: "https://images.pexels.com/photos/1456291/pexels-photo-1456291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Croatia Adriatic sea beach",
      "Croatia coast turquoise water",
      "Split Croatia seaside",
      "Dubrovnik Croatia coastline",
    ],
  },
  {
    match: /bali|indonez/,
    url: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: ["Bali Indonesia beach", "Bali Indonesia tropical island"],
    leadQuery: "Bali Indonesia surf beach",
  },
  {
    match: /surf camp|surfing|surfer|peniche|surf/,
    url: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Portugal surf camp beach",
      "Peniche Portugal surfing",
      "surf camp Europe ocean",
    ],
    leadQuery: "surf camp sunset wave",
  },
  {
    match: /mazury|mazur/,
    url: "https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Masurian lakes Poland sunrise",
      "Mazury lake Poland kayak",
      "Masuria Poland lake landscape",
    ],
  },
  {
    match: /norwegia|norway|fjord/,
    url: "https://images.pexels.com/photos/2437299/pexels-photo-2437299.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Norway fjords mountains sea",
      "Norwegian fjord sunset",
      "Norway fjords landscape",
    ],
  },
  {
    match: /islandia|iceland/,
    url: "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Iceland aurora landscape",
      "Iceland waterfall landscape",
      "Iceland mountains snow",
    ],
  },
  {
    match: /santorini|grecja|greece/,
    url: "https://images.pexels.com/photos/1068983/pexels-photo-1068983.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: [
      "Santorini Greece blue domes",
      "Greece island sunset",
      "Santorini cliff village sea",
    ],
  },
  {
    match: /merzouga|sahara|maroko|morocco/,
    url: "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1600",
    queries: ["Sahara desert Morocco dunes", "Morocco desert dunes sunset"],
  },
];

const presetFallbacks: Record<TripAccentPreset, string[]> = {
  mountains: [
    "https://images.pexels.com/photos/1441974/pexels-photo-1441974.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/547115/pexels-photo-547115.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  beach: [
    "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1456291/pexels-photo-1456291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1068983/pexels-photo-1068983.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  city: [
    "https://images.pexels.com/photos/532892/pexels-photo-532892.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  desert: [
    "https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1860710/pexels-photo-1860710.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  tropical: [
    "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3601453/pexels-photo-3601453.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  winter: [
    "https://images.pexels.com/photos/1441974/pexels-photo-1441974.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/547115/pexels-photo-547115.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  lake: [
    "https://images.pexels.com/photos/1482061/pexels-photo-1482061.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  countryside: [
    "https://images.pexels.com/photos/318987/pexels-photo-318987.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/51951/field-clouds-sky-earth-51951.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  adventure: [
    "https://images.pexels.com/photos/808465/pexels-photo-808465.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2051196/pexels-photo-2051196.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  neutral: [
    "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
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

export function buildDestinationQueries(
  destination: string,
  preset: TripAccentPreset = "neutral"
) {
  const translated = translateToEnglishTokens(destination || "");
  const parts = translated
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const primary = parts[0] || translated || destination.trim() || "";
  const secondary = parts.length > 1 ? parts[1] : "";

  const normalizedDestination = normalizeToAsciiLower(destination);
  const extraFromPrebaked = getPrebakedQueries(destination);
  const fallbackEntry = destinationFallbacks.find(({ match }) =>
    match.test(normalizedDestination)
  );
  const extraFromFallback = fallbackEntry?.queries ?? [];
  const leadQuery = fallbackEntry?.leadQuery ? [fallbackEntry.leadQuery] : [];

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
    ...leadQuery, // prefer curated lead for a given place
    ...extraFromPrebaked,
    ...extraFromLearned,
    ...extraFromFallback,
    ...contextual,
    ...descriptiveCombos,
    ...baseQueries,
    ...withPresetHints,
  ];

  return Array.from(new Set(all.filter((v) => v && v.trim().length > 0)));
}

export function findSpecificDestinationImage(destination: string) {
  const learned = learnedDestinations.get(normalizeKey(destination));
  if (learned?.imageUrl) return learned.imageUrl;

  const normalizedDestination = normalizeToAsciiLower(destination);
  const match = destinationFallbacks.find(({ match }) =>
    match.test(normalizedDestination)
  );
  return match?.url ?? null;
}

function pickFromPool(values: string[], seedText: string) {
  if (!values.length) return "";
  const seed = hashString(seedText);
  const index = Math.abs(seed) % values.length;
  return values[index];
}

function hashString(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function findDestinationFallbackImage(
  destination: string,
  preset: TripAccentPreset = "neutral"
) {
  const normalizedDestination = normalizeToAsciiLower(destination);
  const match = destinationFallbacks.find(({ match }) =>
    match.test(normalizedDestination)
  );
  if (match?.url) return match.url;

  const pool = presetFallbacks[preset] ?? presetFallbacks.neutral;
  const safePool = pool.length ? pool : presetFallbacks.neutral;
  return pickFromPool(safePool, normalizedDestination || preset);
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
