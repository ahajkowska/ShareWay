import type { Trip, TripAccentPreset } from "@/lib/types/trip";
import {
  buildDestinationImageCandidates,
  selectCandidate,
  type DestinationImageCandidate,
} from "@/lib/server/destinationImage";

export async function getImagesForTrips(
  trips: Trip[]
): Promise<Record<string, string | null>> {
  const usedUrls = new Set<string>();
  const result: Record<string, string | null> = {};
  const candidateCache = new Map<
    string,
    Promise<DestinationImageCandidate[]>
  >();

  await Promise.all(
    trips.map(async (trip) => {
      const preset = getAccentPreset(trip);
      const context = `${trip.name} ${trip.description ?? ""}`.trim();
      const normalizedContext = context.toLowerCase().replace(/\s+/g, " ");
      const cacheKey = `${trip.destination
        .toLowerCase()
        .trim()}|${preset}|${normalizedContext}`;
      let promise = candidateCache.get(cacheKey);
      if (!promise) {
        promise = buildDestinationImageCandidates(
          trip.destination,
          preset,
          {
            cache: "force-cache",
          },
          context
        );
        candidateCache.set(cacheKey, promise);
      }
      const candidates = await promise;
      const url = selectCandidate(candidates, usedUrls);
      if (url) {
        usedUrls.add(url);
      }
      result[trip.id] = url ?? null;
    })
  );

  return result;
}

function getAccentPreset(trip: Trip): TripAccentPreset {
  if (trip.accentPreset) return trip.accentPreset;
  const text = `${trip.name} ${trip.destination}`.toLowerCase();
  if (/beach|sea|ocean|coast|island|tropical|morze|plaża/.test(text)) {
    return "beach";
  }
  if (/mountain|alps|hiking|peak|ski|góry|tatry|zakopane/.test(text)) {
    return "mountains";
  }
  if (/city|urban|downtown|metro|miasto|barcelona|paris/.test(text)) {
    return "city";
  }
  if (/desert|sahara|dune|pustyn/i.test(text)) return "desert";
  if (/tropic|island|bali|hawai|palma/i.test(text)) return "tropical";
  if (/winter|snow|ski|zima|lodow|iceland/i.test(text)) return "winter";
  if (/lake|jezior|mazury|fjord/i.test(text)) return "lake";
  if (/village|countryside|farm|wieś|wiejski/i.test(text)) return "countryside";
  if (/camp|adventure|forest|obóz|biwak/i.test(text)) return "adventure";
  return "neutral";
}
