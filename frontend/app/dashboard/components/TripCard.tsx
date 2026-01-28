"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  MapPin,
  Calendar,
  Copy,
  ChevronRight,
  Users,
  Pencil,
  Archive,
  Trash2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Trip, TripAccentPreset, TripMember } from "@/lib/types/trip";
import { toast } from "sonner";

interface TripCardProps {
  trip: Trip;
  index: number;
  onOpen: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onGenerateCode?: (trip: Trip) => void;
  onArchive?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
}

const accentStyles: Record<
  TripAccentPreset,
  { gradient: string; glow: string; badge: string }
> = {
  beach: {
    gradient: "from-trip-beach/20 via-trip-beach/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_hsl(var(--trip-beach)/0.5)]",
    badge: "bg-trip-beach/10 text-trip-beach border-trip-beach/30",
  },
  mountains: {
    gradient: "from-trip-mountains/20 via-trip-mountains/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_hsl(var(--trip-mountains)/0.5)]",
    badge: "bg-trip-mountains/10 text-trip-mountains border-trip-mountains/30",
  },
  city: {
    gradient: "from-trip-city/20 via-trip-city/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_hsl(var(--trip-city)/0.5)]",
    badge: "bg-trip-city/10 text-trip-city border-trip-city/30",
  },
  neutral: {
    gradient: "from-primary/10 via-accent/5 to-transparent",
    glow: "group-hover:shadow-card-hover",
    badge: "bg-muted text-muted-foreground border-border",
  },
  desert: {
    gradient: "from-orange-400/10 via-amber-300/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_rgba(251,191,36,0.35)]",
    badge: "bg-amber-200/40 text-amber-700 border-amber-300/60",
  },
  tropical: {
    gradient: "from-cyan-400/15 via-emerald-300/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.35)]",
    badge: "bg-emerald-200/40 text-emerald-700 border-emerald-300/60",
  },
  winter: {
    gradient: "from-sky-300/15 via-slate-200/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_rgba(125,211,252,0.35)]",
    badge: "bg-sky-200/40 text-sky-800 border-sky-300/60",
  },
  lake: {
    gradient: "from-indigo-400/15 via-cyan-300/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_rgba(59,130,246,0.35)]",
    badge: "bg-indigo-200/40 text-indigo-800 border-indigo-300/60",
  },
  countryside: {
    gradient: "from-emerald-300/15 via-lime-300/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_rgba(74,222,128,0.35)]",
    badge: "bg-emerald-200/40 text-emerald-800 border-emerald-300/60",
  },
  adventure: {
    gradient: "from-orange-400/15 via-lime-300/10 to-transparent",
    glow: "group-hover:shadow-[0_8px_40px_-12px_rgba(249,115,22,0.35)]",
    badge: "bg-orange-200/40 text-orange-800 border-orange-300/60",
  },
};

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

const imageUrlCache = new Map<string, string>();
const LOCAL_CACHE_KEY = "dashboard-destination-image-cache-v2-no-fallback";
let cacheHydratedFromStorage = false;

function hydrateCacheFromStorage() {
  if (cacheHydratedFromStorage) return;
  cacheHydratedFromStorage = true;
  if (typeof window === "undefined") return;

  try {
    // Drop legacy cache that could contain fallback images.
    window.localStorage.removeItem("dashboard-destination-image-cache-v1");
    const raw = window.localStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, string>;
    Object.entries(parsed).forEach(([key, value]) => {
      if (typeof key === "string" && typeof value === "string") {
        imageUrlCache.set(key, value);
      }
    });
  } catch {}
}

function persistCacheToStorage() {
  if (typeof window === "undefined") return;
  const entries = Array.from(imageUrlCache.entries());
  const limited = entries.slice(Math.max(0, entries.length - 50));
  const asObject = Object.fromEntries(limited);
  try {
    window.localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(asObject));
  } catch {}
}

const fallbackMembers: TripMember[] = [
  { id: "f1", name: "Alicja Nowak" },
  { id: "f2", name: "Bartek Kowalski" },
  { id: "f3", name: "Celina Wójcik" },
  { id: "f4", name: "Darek Lis" },
  { id: "f5", name: "Ewa Maj" },
  { id: "f6", name: "Filip Król" },
];

function withFallbackMembers(trip: Trip): TripMember[] {
  if (trip.members.length > 0) return trip.members;
  // Deterministyczny fallback
  const seed = Number(trip.id) || trip.id.length;
  return fallbackMembers
    .map((m, i) => ({ ...m, id: `${m.id}-${seed + i}` }))
    .slice(seed % 3, (seed % 3) + 4);
}

export default function TripCard({
  trip,
  index,
  onOpen,
  onEdit,
  onGenerateCode,
  onArchive,
  onDelete,
}: TripCardProps) {
  const isOrganizer = trip.roleForCurrentUser === "ORGANIZER";
  const isArchived = trip.status === "ARCHIVED";
  const preset = getAccentPreset(trip);
  const style = accentStyles[preset];
  const cacheKey = useMemo(
    () => `${preset}:${trip.destination.toLowerCase()}`,
    [preset, trip.destination]
  );
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    return imageUrlCache.get(cacheKey) ?? null;
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    hydrateCacheFromStorage();
    const cached = imageUrlCache.get(cacheKey);
    if (cached) {
      setImageUrl(cached);
      return () => {
        controller.abort();
      };
    }

    setImageUrl(null);

    const load = async () => {
      try {
        const params = new URLSearchParams({
          q: trip.destination,
          preset,
        });
        const res = await fetch(`/api/destination-image?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;

        const data = (await res.json()) as { url?: string };
        if (mounted && data?.url) {
          setImageUrl(data.url);
          imageUrlCache.set(cacheKey, data.url);
          persistCacheToStorage();
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [cacheKey, preset, trip.destination]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "short",
    });

  const members = withFallbackMembers(trip);
  const displayedMembers = members.slice(0, 3);
  const remainingCount = Math.max(members.length - 3, 0);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trip.inviteCode) {
      navigator.clipboard.writeText(trip.inviteCode);
      toast.success("Kod skopiowany!", { description: trip.inviteCode });
    }
  };

  const avatarPalettes: Record<TripAccentPreset, string[]> = {
    beach: [
      "bg-sky-500/60 dark:bg-sky-400/60",
      "bg-cyan-400/60 dark:bg-cyan-300/60",
      "bg-amber-400/60 dark:bg-amber-300/60",
    ],
    mountains: [
      "bg-indigo-500/60 dark:bg-indigo-400/60",
      "bg-violet-500/60 dark:bg-violet-400/60",
      "bg-blue-500/60 dark:bg-blue-400/60",
    ],
    city: [
      "bg-orange-500/60 dark:bg-orange-400/60",
      "bg-rose-500/60 dark:bg-rose-400/60",
      "bg-amber-500/60 dark:bg-amber-400/60",
    ],
    desert: [
      "bg-amber-500/50 dark:bg-amber-400/50",
      "bg-orange-400/50 dark:bg-orange-300/50",
      "bg-yellow-400/50 dark:bg-yellow-300/50",
    ],
    tropical: [
      "bg-cyan-400/55 dark:bg-cyan-300/55",
      "bg-emerald-400/55 dark:bg-emerald-300/55",
      "bg-amber-400/55 dark:bg-amber-300/55",
    ],
    winter: [
      "bg-sky-300/55 dark:bg-sky-200/55",
      "bg-slate-300/55 dark:bg-slate-200/55",
      "bg-indigo-300/55 dark:bg-indigo-200/55",
    ],
    lake: [
      "bg-indigo-400/55 dark:bg-indigo-300/55",
      "bg-cyan-400/55 dark:bg-cyan-300/55",
      "bg-violet-400/55 dark:bg-violet-300/55",
    ],
    countryside: [
      "bg-emerald-400/55 dark:bg-emerald-300/55",
      "bg-lime-400/55 dark:bg-lime-300/55",
      "bg-amber-400/55 dark:bg-amber-300/55",
    ],
    adventure: [
      "bg-orange-400/55 dark:bg-orange-300/55",
      "bg-lime-400/55 dark:bg-lime-300/55",
      "bg-emerald-400/55 dark:bg-emerald-300/55",
    ],
    neutral: [
      "bg-slate-500/60 dark:bg-slate-400/60",
      "bg-gray-500/60 dark:bg-gray-400/60",
      "bg-zinc-500/60 dark:bg-zinc-400/60",
    ],
  };
  const avatarColors = avatarPalettes[preset];

  const daysUntil = Math.ceil(
    (new Date(trip.startDate).getTime() - Number(new Date())) /
      (1000 * 60 * 60 * 24)
  );
  const tripDuration = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="h-full group perspective-1000"
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="h-full cursor-pointer"
        onClick={() => onOpen(trip)}
      >
        <div
          className={cn(
            "relative h-full rounded-2xl overflow-hidden min-h-[280px]",
            "border border-border/50 bg-card",
            "shadow-card transition-all duration-500",
            style.glow,
            isArchived && "opacity-70 grayscale-35 contrast-90"
          )}
        >
          {isArchived && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-background/55 z-10"
            />
          )}
          <div className="relative h-28 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Zdjęcie destynacji ${trip.destination}`}
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 360px, (min-width: 768px) 320px, 100vw"
                unoptimized
                priority={index < 3}
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-background via-muted/30 to-background" />
            )}
            <div className="absolute inset-0 bg-linear-to-br from-black/15 via-black/10 to-transparent dark:from-background/70 dark:via-background/45 dark:to-background/25 transition-colors" />
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-b pointer-events-none mix-blend-multiply dark:mix-blend-normal",
                style.gradient
              )}
            />

            {!isArchived && daysUntil > 0 && (
              <div className="absolute top-3 left-3">
                <div className="px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50">
                  <span className="text-xs font-bold text-foreground">
                    {daysUntil}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-1">
                    dni
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col h-[calc(100%-7rem)]">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {trip.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest">
                  {isOrganizer ? "Organizator" : "Uczestnik"}
                </span>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 backdrop-blur-sm",
                  isArchived
                    ? "bg-muted/80 text-muted-foreground border-border"
                    : "bg-accent/10 text-accent border-accent/30"
                )}
              >
                {isArchived ? "Archiwum" : "Aktywna"}
              </Badge>
            </div>

            <div className="space-y-1.5 flex-1 text-[12px] sm:text-[13px]">
              <div className="flex items-center gap-2 text-foreground/80 leading-tight">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">{trip.destination}</span>
              </div>

              <div className="flex items-center gap-2 text-foreground/80 leading-tight">
                <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>
                  {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                  <span className="text-muted-foreground ml-1">
                    ({tripDuration} dni)
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-foreground/80 leading-tight">
                <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>{members.length} uczestników</span>
              </div>

              {trip.description && (
                <p className="text-[12px] text-muted-foreground line-clamp-2 mt-1">
                  {trip.description}
                </p>
              )}
            </div>

            <div className="pt-3 mt-auto border-top border-border/50">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {displayedMembers.map((m, i) => (
                    <Avatar
                      key={m.id}
                      className="h-7 w-7 border-2 border-card ring-0 rounded-full"
                    >
                      <AvatarFallback
                        className={cn(
                          "text-[10px] font-semibold text-white rounded-full",
                          avatarColors[i % avatarColors.length]
                        )}
                      >
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                {remainingCount > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    +{remainingCount}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {!isArchived && trip.inviteCode && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyCode}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      aria-label="Skopiuj kod"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {!isArchived &&
                    isOrganizer &&
                    !trip.inviteCode &&
                    onGenerateCode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerateCode(trip);
                        }}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        aria-label="Wygeneruj kod"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  {!isArchived && isOrganizer && onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(trip);
                      }}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      aria-label="Edytuj"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {isOrganizer && onArchive && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(trip);
                      }}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      aria-label={isArchived ? "Przywróć" : "Archiwizuj"}
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {isArchived && isOrganizer && onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(trip);
                      }}
                      className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                      aria-label="Usuń"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(trip);
                  }}
                  className="rounded-lg text-xs h-8 px-3 group/btn hover:bg-muted/50"
                >
                  Otwórz
                  <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
