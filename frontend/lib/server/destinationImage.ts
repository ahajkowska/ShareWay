import {
  getLocationDetails,
  buildDestinationQueries,
  type LocationDetails,
} from "@/lib/location";
import { PRESET_HINTS, ALT_KEYWORD_WEIGHTS } from "@/lib/imagePresets";
import type { TripAccentPreset } from "@/lib/types/trip";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const RERANK_URL = process.env.RERANK_URL || process.env.EMBEDDING_RERANKER_URL;
const MAX_PHOTOS = 40;

type PexelsPhotoBase = {
  id: number;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
  };
  alt?: string;
};

type PexelsPhoto = PexelsPhotoBase & {
  queryPriority: number;
};

type RequestCacheMode =
  | "default"
  | "no-store"
  | "reload"
  | "no-cache"
  | "force-cache"
  | "only-if-cached";

export type DestinationImageCandidate = {
  index: number;
  url: string;
  alt: string;
  score: number;
  queryPriority: number;
};

type WeightedQuery = {
  text: string;
  priority: number;
};

export type ImageCandidatesOptions = {
  cache?: RequestCacheMode;
};

export async function buildDestinationImageCandidates(
  destination: string,
  preset: TripAccentPreset,
  options?: ImageCandidatesOptions,
  context?: string
): Promise<DestinationImageCandidate[]> {
  if (!destination.trim() || !PEXELS_API_KEY) return [];

  let location: LocationDetails;
  try {
    location = await getLocationDetails(destination);
  } catch (err) {
    console.warn("Failed to resolve location details", err);
    return [];
  }
  const queries = buildWeightedQueries(location, preset, context);
  const photos = await fetchPhotosForQueries(
    queries,
    options?.cache ?? "force-cache"
  );

  if (!photos.length) return [];

  const candidates = photos.map((photo, index) => ({
    index,
    url: photo.src.large2x || photo.src.large || photo.src.original,
    alt: photo.alt ?? "",
    score: 0,
    queryPriority: photo.queryPriority ?? 0,
  }));

  const clipScores = await rerankCandidates(
    location,
    preset,
    candidates,
    context
  );

  const scored = candidates.map((candidate) => {
    const clip = clipScores.get(candidate.index) ?? 0;
    const alt = scoreAlt(candidate.alt, preset, context);
    const priorityBonus = candidate.queryPriority ?? 0;
    return {
      ...candidate,
      score: clip + 0.15 * alt + 0.25 * priorityBonus,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export function selectCandidate(
  candidates: DestinationImageCandidate[],
  usedUrls?: Set<string>
): string | null {
  for (const candidate of candidates) {
    if (!candidate.url) continue;
    if (usedUrls && usedUrls.has(candidate.url)) continue;
    return candidate.url;
  }
  return candidates[0]?.url ?? null;
}

async function fetchPhotosForQueries(
  queries: WeightedQuery[],
  cache: RequestCacheMode
): Promise<PexelsPhoto[]> {
  const seen = new Set<number>();
  const fetchedPhotos: PexelsPhoto[] = [];

  for (const query of queries) {
    if (fetchedPhotos.length >= MAX_PHOTOS) break;

    const searchParams = new URLSearchParams({
      query: query.text,
      per_page: "15",
      orientation: "landscape",
    });

    try {
      const headers: HeadersInit = {};
      if (PEXELS_API_KEY) {
        headers.Authorization = PEXELS_API_KEY;
      }
      const res = await fetch(
        `https://api.pexels.com/v1/search?${searchParams.toString()}`,
        {
          headers,
          cache,
        }
      );

      if (!res.ok) continue;

      const data = (await res.json()) as {
        photos?: PexelsPhotoBase[];
      };
      const batch = data.photos ?? [];

      for (const photo of batch) {
        if (seen.has(photo.id)) continue;
        seen.add(photo.id);
        fetchedPhotos.push({
          ...photo,
          queryPriority: query.priority,
        });
        if (fetchedPhotos.length >= MAX_PHOTOS) break;
      }
    } catch (err) {
      console.warn("Pexels search failed", err);
      continue;
    }
  }

  return fetchedPhotos;
}

async function fetchSinglePexelsPhoto(
  query: string,
  cache: RequestCacheMode = "force-cache"
): Promise<string | null> {
  if (!PEXELS_API_KEY) return null;

  const searchParams = new URLSearchParams({
    query,
    per_page: "1",
    orientation: "landscape",
  });

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?${searchParams.toString()}`,
      {
        headers: { Authorization: PEXELS_API_KEY },
        cache,
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as { photos?: PexelsPhotoBase[] };
    const photo = data.photos?.[0];
    if (!photo) return null;
    return photo.src.large2x || photo.src.large || photo.src.original || null;
  } catch (err) {
    console.warn("Pexels single search failed", err);
    return null;
  }
}

export async function fetchFallbackPexelsImage(
  destination: string,
  preset: TripAccentPreset,
  cache: RequestCacheMode = "no-store"
): Promise<string | null> {
  const presetHint = PRESET_HINTS[preset] ?? "";
  const queries: string[] = [];
  if (destination) queries.push(destination);
  if (presetHint) queries.push(`${presetHint} ${destination}`);
  queries.push("travel landscape");
  queries.push("travel destination");

  for (const q of queries) {
    const url = await fetchSinglePexelsPhoto(q, cache);
    if (url) return url;
  }

  return null;
}

async function rerankCandidates(
  location: LocationDetails,
  preset: TripAccentPreset,
  candidates: DestinationImageCandidate[],
  context?: string
): Promise<Map<number, number>> {
  const clipScores = new Map<number, number>();
  if (!RERANK_URL) return clipScores;

  const prompt = buildPrompt(location, preset, context);

  try {
    const rerankRes = await fetch(RERANK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        candidates: candidates.map((candidate) => ({
          index: candidate.index,
          url: candidate.url,
          alt: candidate.alt,
        })),
      }),
    });

    if (!rerankRes.ok) {
      console.warn("Rerank HTTP error", rerankRes.status);
      return clipScores;
    }

    const data = (await rerankRes.json()) as {
      indices?: number[];
      scores?: number[];
    };

    if (Array.isArray(data.indices) && Array.isArray(data.scores)) {
      data.indices.forEach((idx, i) => {
        clipScores.set(idx, data.scores?.[i] ?? 0);
      });
    }
  } catch (err) {
    console.warn("Rerank request failed", err);
  }

  return clipScores;
}

function buildPrompt(
  location: LocationDetails,
  preset: TripAccentPreset,
  context?: string
): string {
  const basePlace =
    location.englishCombined ||
    location.combined ||
    location.englishCity ||
    location.city ||
    location.normalized ||
    "travel";

  const hints = PRESET_HINTS[preset] ?? PRESET_HINTS.neutral;
  const hintsText = hints.join(", ");

  const normalizedContext = context?.trim().replace(/\s+/g, " ");
  const prefix = normalizedContext ? `${normalizedContext}, ${basePlace}` : basePlace;
  return `${prefix}, travel photo, ${hintsText}`;
}

function buildWeightedQueries(
  location: LocationDetails,
  preset: TripAccentPreset,
  context?: string
): WeightedQuery[] {
  const baseQueries = buildDestinationQueries(location, preset);
  const hints = PRESET_HINTS[preset] ?? PRESET_HINTS.neutral;
  const seen = new Set<string>();
  const weighted: WeightedQuery[] = [];
  let nextPriority = baseQueries.length + hints.length + 5;

  const add = (text?: string, priority?: number) => {
    const normalized = text?.trim();
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    weighted.push({
      text: normalized,
      priority: priority ?? nextPriority,
    });
    nextPriority = (priority ?? nextPriority) - 1;
  };

  const normalizedContext = context?.trim().replace(/\s+/g, " ");
  if (normalizedContext) {
    add(`${normalizedContext} ${baseQueries[0] ?? ""}`, nextPriority + 3);
    add(`${normalizedContext}`, nextPriority + 2);
    for (const part of normalizedContext.split(" ").filter(Boolean)) {
      if (part.length < 3) continue;
      add(`${part} ${baseQueries[0] ?? ""}`, nextPriority + 1);
    }
  }

  baseQueries.forEach((q, index) =>
    add(q, baseQueries.length - index)
  );

  hints.forEach((hint, index) =>
    add(`${hint} ${baseQueries[0] ?? ""}`, Math.max(nextPriority - index, 1))
  );

  if (weighted.length === 0 && location.combined) {
    add(location.combined, 1);
  }

  return weighted;
}

function scoreAlt(alt: string, preset: TripAccentPreset, context?: string): number {
  if (!alt) return 0;
  const lower = alt.toLowerCase();
  let score = 0;

  for (const [keyword, weight] of Object.entries(ALT_KEYWORD_WEIGHTS)) {
    if (lower.includes(keyword)) {
      score += weight;
    }
  }

  const presetHints = PRESET_HINTS[preset] ?? PRESET_HINTS.neutral;
  for (const hint of presetHints) {
    if (lower.includes(hint.toLowerCase())) {
      score += 1.5;
    }
  }

  if (context) {
    const normalizedContext = context.toLowerCase().replace(/[^a-z0-9ąćęłńóśżź]+/g, " ");
    const keywords = normalizedContext.split(/\s+/).filter(Boolean);
    for (const keyword of keywords) {
      if (keyword.length < 3) continue;
      if (lower.includes(keyword)) {
        score += 1.25;
      }
    }
  }

  if (preset === "beach" && /beach|sea|ocean|coast|tropical/.test(lower)) {
    score += 3;
  }
  if (preset === "mountains" && /mountain|peak|alps|hiking/.test(lower)) {
    score += 3;
  }
  if (preset === "city" && /city|street|skyline|urban/.test(lower)) {
    score += 3;
  }

  return score;
}
