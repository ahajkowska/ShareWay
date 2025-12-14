import type { TripAccentPreset } from "@/lib/types/trip";

export const PRESET_HINTS: Record<TripAccentPreset, string[]> = {
  mountains: ["mountain landscape", "peaks", "alps", "hiking", "scenic view"],
  beach: ["beach", "coastline", "sea", "sunset", "tropical"],
  city: ["city skyline", "architecture", "streets", "urban view"],
  neutral: ["landscape", "travel", "nature", "scenic view"],
  desert: ["desert", "sand dunes", "sunset"],
  tropical: ["beach", "palm trees", "tropical", "coast"],
  winter: ["snow", "winter landscape", "ski resort", "mountains"],
  lake: ["lake", "water reflection", "nature"],
  countryside: ["fields", "village", "farmhouses"],
  adventure: ["hiking", "outdoor adventure", "trail", "extreme"],
};

export const ATTRACTION_HINTS = [
  "tourist attractions",
  "landmarks",
  "points of interest",
  "things to do",
  "famous places",
  "sightseeing",
  "top sights",
  "historic center",
  "old town",
  "monuments",
] as const;

export const GENERIC_HINTS = [
  "travel guide",
  "tourism",
  "sightseeing highlights",
] as const;

export const ALT_KEYWORD_WEIGHTS: Record<string, number> = {
  landscape: 3,
  city: 3,
  architecture: 2,
  mountain: 2,
  beach: 2,
  skyline: 1,
  nature: 1,
};
