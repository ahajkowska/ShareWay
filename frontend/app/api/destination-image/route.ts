import { NextRequest, NextResponse } from "next/server";
import type { TripAccentPreset } from "@/lib/types/trip";
import {
  buildDestinationImageCandidates,
  selectCandidate,
  fetchFallbackPexelsImage,
} from "@/lib/server/destinationImage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const presetParam = searchParams.get("preset") || "neutral";
  const preset = (presetParam as TripAccentPreset) ?? "neutral";
  const context = searchParams.get("context") ?? undefined;

  if (!q.trim()) {
    return NextResponse.json(
      { url: null, reason: "Missing q" },
      { status: 400 }
    );
  }

  const candidates = await buildDestinationImageCandidates(
    q,
    preset,
    {
      cache: "no-store",
    },
    context
  );
  const url = selectCandidate(candidates);

  if (!url) {
    const fallback = await fetchFallbackPexelsImage(q, preset, "no-store");
    if (fallback) {
      return NextResponse.json({ url: fallback, reason: "fallback" });
    }
    return NextResponse.json(
      { url: null, reason: "No photos from Pexels" },
      { status: 404 }
    );
  }

  return NextResponse.json({ url });
}
