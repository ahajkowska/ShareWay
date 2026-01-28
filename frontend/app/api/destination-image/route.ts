import { NextResponse } from "next/server";
import type { TripAccentPreset } from "@/lib/types/trip";
import {
  buildDestinationQueries,
  getLocationDetails,
  learnDestination,
  normalizeToAsciiLower,
  translateToEnglishTokens,
} from "@/lib/destinationImageCatalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";
const DISABLE_PEXELS =
  process.env.DISABLE_PEXELS === "1" || process.env.DISABLE_PEXELS === "true";
const EMBEDDING_RERANKER_URL = process.env.EMBEDDING_RERANKER_URL?.trim() || "";

type CacheEntry = { urls: string[]; index: number; source: string };
const memoryCache = new Map<string, CacheEntry>();
const validPresets: TripAccentPreset[] = [
  "mountains",
  "beach",
  "city",
  "neutral",
  "desert",
  "tropical",
  "winter",
  "lake",
  "countryside",
  "adventure",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reset = searchParams.get("reset");
  const stable =
    searchParams.get("stable") === "1" || searchParams.get("stable") === "true";
  if (reset === "1" || reset === "true") {
    memoryCache.clear();
    return NextResponse.json({ cleared: true }, { status: 200 });
  }

  const qRaw = searchParams.get("q") || "";
  const presetParam = searchParams.get("preset");
  const preset: TripAccentPreset = isTripAccentPreset(presetParam)
    ? presetParam
    : "neutral";

  const queries = buildDestinationQueries(qRaw, preset);
  const cacheKey = queries[0] || qRaw || preset;

  const cached = memoryCache.get(cacheKey);
  if (cached && cached.urls.length) {
    const nextIndex = stable
      ? cached.index
      : cached.urls.length > 1
      ? (cached.index + 1) % cached.urls.length
      : cached.index;
    if (!stable) {
      cached.index = nextIndex;
      memoryCache.set(cacheKey, cached);
    }
    return NextResponse.json(
      {
        url: cached.urls[Math.min(nextIndex || 0, cached.urls.length - 1)],
        source: cached.source || "memory-cache",
      },
      { status: 200 }
    );
  }

  // If we already know the image for this destination, reuse it and avoid any fetch.
  if (DISABLE_PEXELS || !PEXELS_API_KEY.trim()) {
    return NextResponse.json(
      {
        error: "Image retrieval disabled or missing PEXELS_API_KEY",
      },
      { status: 503 }
    );
  }

  let pexelsResult: string[] | null = null;
  let usedQuery: string | null = null;
  let source: "pexels-primary" | "pexels-fallback" | null = null;

  for (const query of queries) {
    const tokens = buildScoringTokens(qRaw, query, preset);
    const result = await fetchPexelsCandidates(query, tokens, qRaw);
    if (result.length) {
      pexelsResult = result;
      usedQuery = query;
      source = "pexels-primary";
      break;
    }
  }

  // Broaden the search to similar/related images if exact destination returns nothing.
  if (!pexelsResult) {
    for (const query of buildFallbackPexelsQueries(qRaw, preset, queries)) {
      const tokens = buildScoringTokens(qRaw, query, preset);
      const result = await fetchPexelsCandidates(query, tokens, qRaw);
      if (result.length) {
        pexelsResult = result;
        usedQuery = query;
        source = "pexels-fallback";
        break;
      }
    }
  }

  if (pexelsResult?.length) {
    const unique = Array.from(new Set(pexelsResult));
    const picked = unique[0];

    memoryCache.set(cacheKey, {
      urls: unique,
      index: 0,
      source: source ?? "pexels",
    });

    learnDestination(qRaw, usedQuery ? [usedQuery] : queries, picked);

    return NextResponse.json(
      { url: picked, source: source ?? "pexels" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      error: "No image found from Pexels",
    },
    { status: 404 }
  );
}

function isTripAccentPreset(value: string | null): value is TripAccentPreset {
  return value !== null && validPresets.includes(value as TripAccentPreset);
}

async function fetchPexelsCandidates(
  query: string,
  tokens: string[],
  prompt: string
) {
  if (!PEXELS_API_KEY || !query.trim()) return [];

  const searchParams = new URLSearchParams({
    query,
    per_page: "30",
    orientation: "landscape",
    page: "1",
  });

  const res = await fetch(
    `https://api.pexels.com/v1/search?${searchParams.toString()}`,
    {
      headers: { Authorization: PEXELS_API_KEY },
      cache: "no-store",
    }
  ).catch(() => null);

  if (!res || !res.ok) return [];

  const data = (await res.json()) as {
    photos?: {
      src?: { landscape?: string; large2x?: string };
      alt?: string;
    }[];
  };

  const list = data?.photos ?? [];
  if (!list.length) return [];

  const rerankedTop = await pickByEmbedding(list, prompt);
  const tokenSorted = sortByTokens(list, tokens);

  const ordered = rerankedTop
    ? [rerankedTop, ...tokenSorted.filter((p) => p !== rerankedTop)]
    : tokenSorted;

  return ordered
    .slice(0, 12)
    .map((photo) => photo.src?.landscape || photo.src?.large2x || "")
    .filter(Boolean);
}

function buildScoringTokens(
  destination: string,
  query: string,
  preset: TripAccentPreset
) {
  const translated = translateToEnglishTokens(destination || "");
  const destWords = normalizeToAsciiLower(translated)
    .split(/\s|,/)
    .filter(Boolean);
  const queryWords = normalizeToAsciiLower(query).split(/\s|,/).filter(Boolean);

  const presetHints =
    preset === "mountains"
      ? ["mountains", "landscape"]
      : preset === "beach" || preset === "tropical"
      ? ["beach", "sea", "coast"]
      : preset === "city"
      ? ["city", "skyline"]
      : preset === "lake"
      ? ["lake", "water"]
      : preset === "winter"
      ? ["winter", "snow"]
      : preset === "countryside"
      ? ["countryside", "fields", "village"]
      : preset === "desert"
      ? ["desert", "sand"]
      : preset === "adventure"
      ? ["outdoor", "adventure"]
      : [];

  return Array.from(
    new Set([...destWords, ...queryWords, ...presetHints].filter(Boolean))
  );
}

function buildFallbackPexelsQueries(
  destination: string,
  preset: TripAccentPreset,
  exclude: string[] = []
) {
  const location = getLocationDetails(destination);
  const {
    city,
    country,
    englishCity,
    englishCountry,
    combined,
    englishCombined,
    normalized,
  } = location;

  const genericByPreset: Record<TripAccentPreset, string[]> = {
    mountains: ["mountain landscape sunrise", "alpine mountains view"],
    beach: ["tropical beach sunset", "coastline turquoise water"],
    city: ["modern city skyline night", "historic city old town"],
    neutral: ["beautiful travel landscape", "travel destination aerial"],
    desert: ["desert sand dunes sunset"],
    tropical: ["tropical island beach aerial"],
    winter: ["snowy mountain landscape winter"],
    lake: ["lake with mountains reflection"],
    countryside: ["countryside fields sunrise"],
    adventure: ["hiking trail mountain adventure"],
  };

  const presetFallbacks = genericByPreset[preset] ?? genericByPreset.neutral;
  const presetHints =
    preset === "mountains"
      ? ["mountains", "ridge"]
      : preset === "beach" || preset === "tropical"
      ? ["beach", "sea", "coast"]
      : preset === "city"
      ? ["city skyline", "old town"]
      : preset === "lake"
      ? ["lake", "water"]
      : preset === "winter"
      ? ["winter", "snow"]
      : preset === "countryside"
      ? ["countryside", "fields"]
      : preset === "desert"
      ? ["desert", "dunes"]
      : preset === "adventure"
      ? ["outdoor", "adventure"]
      : ["travel"];

  const joinSegments = (a?: string, b?: string) =>
    a && b ? `${a} ${b}`.trim() : "";

  const withDestination = [
    englishCombined,
    combined,
    joinSegments(city, country),
    joinSegments(country, city),
    joinSegments(englishCity, englishCountry),
    joinSegments(englishCountry, englishCity),
    city ? `${city} ${presetHints[0] ?? ""}`.trim() : "",
    englishCity ? `${englishCity} ${presetHints[0] ?? ""}`.trim() : "",
    city ? `${city} scenic view` : "",
    englishCity ? `${englishCity} scenic view` : "",
  ].filter(Boolean);

  const withCountryHints = [
    country ? `${country} ${presetHints[0] ?? ""}`.trim() : "",
    englishCountry ? `${englishCountry} ${presetHints[0] ?? ""}`.trim() : "",
    country ? `${country} scenic view` : "",
    englishCountry ? `${englishCountry} scenic view` : "",
  ].filter(Boolean);

  const baseCombined =
    englishCombined || combined || normalized || joinSegments(city, country);

  const withCombinedHints = baseCombined
    ? [
        `${baseCombined} ${presetHints[0] ?? ""}`.trim(),
        `${baseCombined} ${presetHints.join(" ")}`.trim(),
        `${baseCombined} travel`,
        `${baseCombined} landscape`,
        `${baseCombined} aerial view`,
      ]
    : [];

  const withSingles = [englishCity, englishCountry, city, country].filter(Boolean);

  const all = [
    ...withDestination,
    ...withCombinedHints,
    ...withSingles,
    ...withCountryHints,
    ...presetFallbacks,
    "travel destination landscape",
  ];
  const excludeSet = new Set(exclude.map((q) => q.toLowerCase().trim()));

  return Array.from(
    new Set(
      all
        .map((q) => q.trim())
        .filter((q) => q && !excludeSet.has(q.toLowerCase()))
    )
  );
}

function pickBestByTokens(
  photos: { src?: { landscape?: string; large2x?: string }; alt?: string }[],
  tokens: string[] = []
) {
  if (!photos.length) return null;
  const fallback =
    photos[Math.floor(Math.random() * Math.max(photos.length, 1))] || null;

  const scored = photos
    .map((photo) => {
      const alt = normalizeToAsciiLower(photo.alt || "");
      let score = 0;
      for (const token of tokens) {
        if (token && alt.includes(token)) score += 3;
      }
      score += alt.length * 0.01;
      return { photo, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score === 0) return fallback;
  return best.photo;
}

function sortByTokens(
  photos: { src?: { landscape?: string; large2x?: string }; alt?: string }[],
  tokens: string[] = []
) {
  return photos
    .map((photo) => {
      const alt = normalizeToAsciiLower(photo.alt || "");
      let score = 0;
      for (const token of tokens) {
        if (token && alt.includes(token)) score += 3;
      }
      score += alt.length * 0.01;
      return { photo, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((p) => p.photo);
}

async function pickByEmbedding(
  photos: {
    src?: { landscape?: string; large2x?: string };
    alt?: string;
  }[],
  prompt: string
) {
  if (!EMBEDDING_RERANKER_URL) return null;
  const candidates = photos
    .map((photo, index) => ({
      index,
      url: photo.src?.landscape || photo.src?.large2x || "",
      alt: photo.alt || "",
    }))
    .filter((c) => !!c.url);

  if (!candidates.length) return null;

  try {
    const res = await fetch(EMBEDDING_RERANKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, candidates }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      indices?: number[];
      scores?: number[];
    };

    const idx =
      (data.indices && data.indices[0]) ??
      (Array.isArray(data.scores)
        ? data.scores
            .map((s, i) => ({ s, i }))
            .sort((a, b) => (b.s ?? 0) - (a.s ?? 0))[0]?.i
        : null);

    if (idx == null || idx < 0 || idx >= photos.length) return null;
    return photos[idx];
  } catch {
    return null;
  }
}
